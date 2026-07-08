import raw from "@/data/days.json";
import type { DayRec, PeriodMeta, PostponedTask } from "./types";

const data = raw as { days: DayRec[]; meta: PeriodMeta[]; postponed?: PostponedTask[] };

export const DAYS: DayRec[] = data.days;
export const META: PeriodMeta[] = data.meta;
/** Sea-trip tasks held for manual rescheduling into August (with Yana). */
export const POSTPONED: PostponedTask[] = data.postponed ?? [];

export const MONTHS = [
  { mi: 6, name: "June" },
  { mi: 7, name: "July" },
  { mi: 8, name: "August" },
] as const;

export const TOTAL_DAYS = DAYS.length;
export const TOTAL_TASKS = DAYS.reduce((s, d) => s + d.count, 0);
export const TOTAL_TESTS = DAYS.reduce(
  (s, d) => s + d.items.filter((i) => i.test).length,
  0,
);

export const BY_DATE: Record<string, DayRec> = Object.fromEntries(
  DAYS.map((d) => [d.date, d]),
);

export const FIRST_DATE = DAYS[0].date;
export const LAST_DATE = DAYS[DAYS.length - 1].date;

/** Real "today" as yyyy-mm-dd in local time. */
export function todayISO(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(
    n.getDate(),
  ).padStart(2, "0")}`;
}

/** Monday-first weekday index (0=Mon … 6=Sun) for an ISO date. */
export function mondayIndex(iso: string): number {
  const d = new Date(iso + "T00:00:00");
  return (d.getDay() + 6) % 7;
}

export const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
