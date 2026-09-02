import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/constants";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, slug, description, status, entries(count)")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Proyectos</h1>
        <Link href="/projects/new" className="btn-primary">
          Nuevo proyecto
        </Link>
      </div>

      {!projects?.length ? (
        <div className="card mt-6 text-center text-sm text-muted">
          Aún no tienes proyectos. Crea el primero para empezar a registrar avances.
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.slug}`} className="card block hover:border-accent">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted">
                    {STATUS_LABEL[p.status as ProjectStatus]} · {p.entries[0]?.count ?? 0} entradas
                  </span>
                </div>
                {p.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
