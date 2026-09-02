import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/constants";
import { createEntry } from "@/app/actions/entries";
import { EntryForm } from "@/components/entry-form";
import { Timeline } from "@/components/timeline";

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!project) notFound();

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("project_id", project.id)
    .order("shipped_at", { ascending: false })
    .order("created_at", { ascending: false });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted">
            <Link href="/" className="hover:underline">Proyectos</Link> / {STATUS_LABEL[project.status as ProjectStatus]}
          </p>
          <h1 className="text-xl font-semibold">{project.name}</h1>
          {project.description ? (
            <p className="mt-1 text-sm text-muted">{project.description}</p>
          ) : null}
          {project.repo_url ? (
            <a href={project.repo_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-accent hover:underline">
              {project.repo_url.replace(/^https?:\/\//, "")}
            </a>
          ) : null}
        </div>
        <Link href={`/projects/${project.slug}/edit`} className="btn-ghost">Editar</Link>
      </div>

      <div className="mt-6">
        <EntryForm action={createEntry} projectId={project.id} slug={project.slug} today={today} />
      </div>

      <div className="mt-8">
        <Timeline entries={entries ?? []} slug={project.slug} />
      </div>
    </>
  );
}
