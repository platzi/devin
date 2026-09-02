"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isKind } from "@/lib/constants";
import type { ActionState } from "./projects";

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parseTags(raw: string): string[] {
  return [...new Set(raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function parseEntry(fd: FormData) {
  const title = str(fd, "title");
  const kind = str(fd, "kind") || "feature";
  const shipped_at = str(fd, "shipped_at");
  if (!title) return { error: "El título es obligatorio." } as const;
  if (!isKind(kind)) return { error: "Tipo inválido." } as const;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(shipped_at))
    return { error: "Fecha inválida." } as const;
  return {
    data: {
      title,
      kind,
      shipped_at,
      body: str(fd, "body") || null,
      tags: parseTags(str(fd, "tags")),
    },
  } as const;
}

export async function createEntry(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const { supabase, user } = await requireUser();
  const project_id = str(fd, "project_id");
  const slug = str(fd, "slug");
  const parsed = parseEntry(fd);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase
    .from("entries")
    .insert({ ...parsed.data, project_id, user_id: user.id });
  if (error) return { error: error.message };

  revalidatePath(`/projects/${slug}`);
  return undefined;
}

export async function updateEntry(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const { supabase } = await requireUser();
  const id = str(fd, "id");
  const slug = str(fd, "slug");
  const parsed = parseEntry(fd);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase.from("entries").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath(`/projects/${slug}`);
  redirect(`/projects/${slug}`);
}

export async function deleteEntry(fd: FormData): Promise<void> {
  const { supabase } = await requireUser();
  const id = str(fd, "id");
  const slug = str(fd, "slug");
  await supabase.from("entries").delete().eq("id", id);
  revalidatePath(`/projects/${slug}`);
}
