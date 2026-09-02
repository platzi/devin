import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/project-form";
import { deleteProject, updateProject } from "@/app/actions/projects";

export default async function EditProjectPage({
  params,
}: PageProps<"/projects/[slug]/edit">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!project) notFound();

  return (
    <>
      <h1 className="text-xl font-semibold">Editar proyecto</h1>
      <div className="mt-6">
        <ProjectForm action={updateProject} project={project} />
      </div>
      <form
        action={deleteProject}
        className="mt-8 flex items-center justify-between rounded-lg border border-rose-200 p-4"
      >
        <input type="hidden" name="id" value={project.id} />
        <p className="text-sm text-muted">
          Eliminar el proyecto borra también todas sus entradas.
        </p>
        <button type="submit" className="btn-danger">
          Eliminar proyecto
        </button>
      </form>
    </>
  );
}
