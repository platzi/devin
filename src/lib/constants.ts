export const PROJECT_STATUSES = ["active", "paused", "done"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Activo",
  paused: "En pausa",
  done: "Terminado",
};

export const ENTRY_KINDS = ["feature", "bugfix", "refactor", "other"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export const KIND_LABEL: Record<EntryKind, string> = {
  feature: "Feature",
  bugfix: "Bugfix",
  refactor: "Refactor",
  other: "Otro",
};

export const KIND_CLASS: Record<EntryKind, string> = {
  feature: "bg-emerald-100 text-emerald-800",
  bugfix: "bg-rose-100 text-rose-800",
  refactor: "bg-sky-100 text-sky-800",
  other: "bg-zinc-200 text-zinc-800",
};

export function isStatus(v: string): v is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(v);
}

export function isKind(v: string): v is EntryKind {
  return (ENTRY_KINDS as readonly string[]).includes(v);
}
