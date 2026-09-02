"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { ENTRY_KINDS, KIND_LABEL } from "@/lib/constants";
import type { ActionState } from "@/app/actions/projects";
import type { Tables } from "@/lib/database.types";

type Props = {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  projectId: string;
  slug: string;
  entry?: Tables<"entries">;
  today: string;
};

export function EntryForm({ action, projectId, slug, entry, today }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!entry && !pending && state === undefined) formRef.current?.reset();
  }, [entry, pending, state]);

  return (
    <form ref={formRef} action={formAction} className="card grid gap-3">
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="slug" value={slug} />
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}

      <div className="grid gap-3 sm:grid-cols-[1fr_140px_150px]">
        <div>
          <label htmlFor="title" className="label">¿Qué construiste?</label>
          <input id="title" name="title" required maxLength={140} className="input" placeholder="Ej: Login con magic link" defaultValue={entry?.title} />
        </div>
        <div>
          <label htmlFor="kind" className="label">Tipo</label>
          <select id="kind" name="kind" className="input" defaultValue={entry?.kind ?? "feature"}>
            {ENTRY_KINDS.map((k) => (
              <option key={k} value={k}>{KIND_LABEL[k]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="shipped_at" className="label">Fecha</label>
          <input id="shipped_at" name="shipped_at" type="date" required className="input" defaultValue={entry?.shipped_at ?? today} />
        </div>
      </div>

      <div>
        <label htmlFor="body" className="label">Detalle (opcional)</label>
        <textarea id="body" name="body" rows={entry ? 5 : 2} className="input" defaultValue={entry?.body ?? ""} />
      </div>

      <div>
        <label htmlFor="tags" className="label">Tags (separados por coma)</label>
        <input id="tags" name="tags" className="input" placeholder="auth, ui" defaultValue={entry?.tags.join(", ")} />
      </div>

      {state?.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}

      <div className="flex justify-end gap-2">
        {entry ? <Link href={`/projects/${slug}`} className="btn-ghost">Cancelar</Link> : null}
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Guardando…" : entry ? "Guardar" : "Registrar avance"}
        </button>
      </div>
    </form>
  );
}
