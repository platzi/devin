"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PROJECT_STATUSES, STATUS_LABEL } from "@/lib/constants";
import type { ActionState } from "@/app/actions/projects";
import type { Tables } from "@/lib/database.types";

type Props = {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  project?: Tables<"projects">;
};

export function ProjectForm({ action, project }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="card grid gap-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div>
        <label htmlFor="name" className="label">Nombre</label>
        <input id="name" name="name" required maxLength={80} className="input" defaultValue={project?.name} />
      </div>

      <div>
        <label htmlFor="description" className="label">Descripción</label>
        <textarea id="description" name="description" rows={3} className="input" defaultValue={project?.description ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="repo_url" className="label">Repo (URL)</label>
          <input id="repo_url" name="repo_url" type="url" placeholder="https://github.com/…" className="input" defaultValue={project?.repo_url ?? ""} />
        </div>
        <div>
          <label htmlFor="status" className="label">Estado</label>
          <select id="status" name="status" className="input" defaultValue={project?.status ?? "active"}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {project ? (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_public" defaultChecked={project.is_public} />
          Proyecto público (habilita la página compartible en la Fase 2)
        </label>
      ) : null}

      {state?.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}

      <div className="flex justify-end gap-2">
        <Link href={project ? `/projects/${project.slug}` : "/"} className="btn-ghost">Cancelar</Link>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Guardando…" : project ? "Guardar" : "Crear proyecto"}
        </button>
      </div>
    </form>
  );
}
