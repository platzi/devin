export type IsoWeek = { year: number; week: number };

/** Semana ISO 8601 (lunes a domingo) a partir de una fecha `yyyy-mm-dd`. */
export function isoWeekOf(dateStr: string): IsoWeek {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

export function weekKey({ year, week }: IsoWeek): string {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Lunes y domingo de una semana ISO, como fechas UTC. */
export function weekRange({ year, week }: IsoWeek): { start: Date; end: Date } {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const start = new Date(jan4);
  start.setUTCDate(jan4.getUTCDate() - jan4Day + 1 + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return { start, end };
}

const fmt = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function weekLabel(w: IsoWeek): string {
  const { start, end } = weekRange(w);
  return `Semana ${w.week} · ${fmt.format(start)} – ${fmt.format(end)} ${w.year}`;
}

export function groupByWeek<T extends { shipped_at: string }>(
  items: T[],
): { key: string; week: IsoWeek; items: T[] }[] {
  const map = new Map<string, { week: IsoWeek; items: T[] }>();
  for (const item of items) {
    const week = isoWeekOf(item.shipped_at);
    const key = weekKey(week);
    const group = map.get(key) ?? { week, items: [] };
    group.items.push(item);
    map.set(key, group);
  }
  return [...map.entries()]
    .map(([key, g]) => ({ key, ...g }))
    .sort((a, b) => (a.key < b.key ? 1 : -1));
}
