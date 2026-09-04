"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PROJECT_STATUSES, STATUS_LABEL } from "@/lib/constants";
import type { ActionState } from "@/app/actions/projects";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  project?: Tables<"projects">;
};

export function ProjectForm({ action, project }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction}>
      <Card className="grid gap-4 p-4">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}

        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" required maxLength={80} defaultValue={project?.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" rows={3} defaultValue={project?.description ?? ""} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="repo_url">Repo (URL)</Label>
            <Input id="repo_url" name="repo_url" type="url" placeholder="https://github.com/…" defaultValue={project?.repo_url ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              name="status"
              defaultValue={project?.status ?? "active"}
              items={PROJECT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {project ? (
          <Label className="flex items-center gap-2 text-sm font-normal">
            <Checkbox name="is_public" defaultChecked={project.is_public} />
            Proyecto público (habilita la página compartible en la Fase 2)
          </Label>
        ) : null}

        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

        <div className="flex justify-end gap-2">
          <Button variant="outline" render={<Link href={project ? `/projects/${project.slug}` : "/"} />}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : project ? "Guardar" : "Crear proyecto"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
