import Link from "next/link";
import { KIND_CLASS, KIND_LABEL, type EntryKind } from "@/lib/constants";
import { groupByWeek, weekLabel } from "@/lib/week";
import { deleteEntry } from "@/app/actions/entries";
import type { Tables } from "@/lib/database.types";

const dayFmt = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function Timeline({ entries, slug }: { entries: Tables<"entries">[]; slug: string }) {
  if (!entries.length) {
    return (
      <p className="card text-center text-sm text-muted">
        Todavía no hay entradas. Registra tu primer avance arriba.
      </p>
    );
  }

  return (
    <div className="grid gap-8">
      {groupByWeek(entries).map((group) => (
        <section key={group.key}>
          <h2 className="mb-3 flex items-baseline justify-between text-sm font-medium">
            <span>{weekLabel(group.week)}</span>
            <span className="text-xs text-muted">{group.items.length} ships</span>
          </h2>
          <ol className="grid gap-2 border-l border-border pl-4">
            {group.items.map((e) => (
              <li key={e.id} className="card relative">
                <span className="absolute -left-[21px] top-5 size-2 rounded-full bg-accent" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">
                    {dayFmt.format(new Date(`${e.shipped_at}T00:00:00Z`))}
                  </span>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${KIND_CLASS[e.kind as EntryKind]}`}>
                    {KIND_LABEL[e.kind as EntryKind]}
                  </span>
                  <span className="font-medium">{e.title}</span>
                </div>
                {e.body ? (
                  <p className="mt-1 whitespace-pre-line text-sm text-muted">{e.body}</p>
                ) : null}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {e.tags.map((t) => (
                      <span key={t} className="rounded bg-background px-1.5 text-xs text-muted">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 text-xs">
                    <Link href={`/projects/${slug}/entries/${e.id}`} className="text-muted hover:underline">
                      Editar
                    </Link>
                    <form action={deleteEntry}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="slug" value={slug} />
                      <button type="submit" className="text-rose-700 hover:underline">
                        Borrar
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
