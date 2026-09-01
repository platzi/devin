"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { isStatus } from "@/lib/constants";

export type ActionState = { error?: string } | undefined;

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function parseProject(fd: FormData) {
  const name = str(fd, "name");
  const status = str(fd, "status") || "active";
  if (!name) return { error: "El nombre es obligatorio." } as const;
  if (!isStatus(status)) return { error: "Estado inválido." } as const;
  const repo_url = str(fd, "repo_url");
  if (repo_url && !/^https?:\/\//.test(repo_url))
    return { error: "El enlace al repo debe empezar por http(s)://" } as const;
  return {
    data: {
      name,
      status,
      description: str(fd, "description") || null,
      repo_url: repo_url || null,
    },
  } as const;
}

export async function createProject(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const parsed = parseProject(fd);
  if ("error" in parsed) return { error: parsed.error };

  const slug = slugify(parsed.data.name);
  if (!slug) return { error: "El nombre debe contener letras o números." };

  const { error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, slug, user_id: user.id });

  if (error) {
    if (error.code === "23505") return { error: "Ya tienes un proyecto con ese nombre." };
    return { error: error.message };
  }

  revalidatePath("/");
  redirect(`/projects/${slug}`);
}

export async function updateProject(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const { supabase } = await requireUser();
  const id = str(fd, "id");
  const parsed = parseProject(fd);
  if ("error" in parsed) return { error: parsed.error };

  const { data, error } = await supabase
    .from("projects")
    .update({ ...parsed.data, is_public: fd.get("is_public") === "on" })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/projects/${data.slug}`);
  redirect(`/projects/${data.slug}`);
}

export async function deleteProject(fd: FormData): Promise<void> {
  const { supabase } = await requireUser();
  const id = str(fd, "id");
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}
