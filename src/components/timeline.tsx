import Link from "next/link";
import { KIND_LABEL, type EntryKind } from "@/lib/constants";
import { groupByWeek, weekLabel } from "@/lib/week";
import { deleteEntry } from "@/app/actions/entries";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const dayFmt = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "numeric",
  timeZone: "UTC",
});

const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
});

const KIND_BADGE_CLASS: Record<EntryKind, string> = {
  feature: "bg-emerald-100 text-emerald-800 border-transparent",
  bugfix: "bg-rose-100 text-rose-800 border-transparent",
  refactor: "bg-sky-100 text-sky-800 border-transparent",
  other: "bg-zinc-200 text-zinc-800 border-transparent",
};

function costBadge(e: Tables<"entries">) {
  const parts: string[] = [];
  if (e.tokens > 0) parts.push(`${e.tokens.toLocaleString()} tokens`);
  if (e.cost_usd > 0) parts.push(usdFmt.format(e.cost_usd));
  if (!parts.length) return null;
  return (
    <Badge variant="outline" className="border-transparent bg-amber-100 text-amber-800">
      {parts.join(" · ")}
    </Badge>
  );
}

export function Timeline({ entries, slug }: { entries: Tables<"entries">[]; slug: string }) {
  if (!entries.length) {
    return (
      <Card className="text-center text-sm text-muted-foreground">
        Todavía no hay entradas. Registra tu primer avance arriba.
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      {groupByWeek(entries).map((group) => (
        <section key={group.key}>
          <h2 className="mb-3 flex items-baseline justify-between text-sm font-medium">
            <span>{weekLabel(group.week)}</span>
            <span className="text-xs text-muted-foreground">{group.items.length} ships</span>
          </h2>
          <ol className="grid gap-2 border-l border-border pl-4">
            {group.items.map((e) => (
              <li key={e.id}>
                <Card className="relative p-4">
                  <span className="absolute -left-[21px] top-5 size-2 rounded-full bg-primary" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {dayFmt.format(new Date(`${e.shipped_at}T00:00:00Z`))}
                    </span>
                    <Badge variant="outline" className={KIND_BADGE_CLASS[e.kind as EntryKind]}>
                      {KIND_LABEL[e.kind as EntryKind]}
                    </Badge>
                    <span className="font-medium">{e.title}</span>
                    {costBadge(e)}
                  </div>
                  {e.body ? (
                    <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{e.body}</p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {e.tags.map((t) => (
                        <span key={t} className="rounded bg-muted px-1.5 text-xs text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 text-xs">
                      <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground" render={<Link href={`/projects/${slug}/entries/${e.id}`} />}>
                        Editar
                      </Button>
                      <form action={deleteEntry}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="slug" value={slug} />
                        <Button type="submit" variant="link" size="sm" className="h-auto p-0 text-destructive">
                          Borrar
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
