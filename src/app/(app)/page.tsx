import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL, type ProjectStatus } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Button render={<Link href="/projects/new" />}>Nuevo proyecto</Button>
      </div>

      {!projects?.length ? (
        <Card className="mt-6 flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="text-6xl leading-none" aria-hidden="true">🚀</span>
          <div className="grid gap-1">
            <p className="text-base font-semibold text-foreground">
              Aún no tienes proyectos
            </p>
            <p className="text-sm text-muted-foreground">
              Crea el primero para empezar a registrar avances.
            </p>
          </div>
          <Button render={<Link href="/projects/new" />}>Crear primer proyecto</Button>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Card className="relative transition hover:ring-foreground/20">
                <Link
                  href={`/projects/${p.slug}`}
                  className="absolute inset-0 rounded-xl"
                  aria-label={p.name}
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{p.name}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">
                      {STATUS_LABEL[p.status as ProjectStatus]}
                    </Badge>
                    {p.entries[0]?.count ?? 0} entradas
                  </span>
                </div>
                {p.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
