export type ItemDiff = "e" | "m" | "h"; // easy / medium / hard
export type ItemType = "x" | "t"; // x = expression (calculation), t = textual (word problem)
export type DayDiff = "easy" | "medium" | "hard" | "test" | "rest" | "travel" | "postponed" | "ill";
export type DayType = "home" | "trip";
export type Trip = "Sea" | "Mountain" | "Valencia";

export interface TaskItem {
  p: string; // page label, e.g. "61"
  r: string; // task range/list, e.g. "7-11"
  n: number; // number of tasks
  d: ItemDiff; // per-task difficulty
  t: ItemType; // per-task type (expression / textual)
  test?: boolean; // true for the 6 review tests
}

export interface DayRec {
  date: string; // ISO yyyy-mm-dd
  dow: string;
  dom: number;
  month: string;
  mi: number; // month index 6/7/8
  period: string; // P1..P5
  trip: Trip | null;
  type: DayType;
  items: TaskItem[];
  count: number;
  diff: DayDiff;
  types: ItemType[]; // which task types appear this day: ["x"], ["t"], or both
  label: string;
}

/** A task pulled off a Sea-trip day, waiting to be rescheduled into August. */
export interface PostponedTask extends TaskItem {
  from: string; // original ISO date it was scheduled on
  dow: string; // that day's weekday label
}

export interface PeriodMeta {
  period: string;
  start: string;
  end: string;
  home: number;
  trip: number;
  tasks: number;
}

export interface Progress {
  /** dateISO -> indices of completed task items */
  tasks: Record<string, number[]>;
  /** dateISO -> true for completed "free"/rest days (no task items) */
  freeDone: Record<string, boolean>;
  /** ids of badges ever earned — sticky, so achievements never un-earn themselves */
  badges: string[];
  updatedAt: string; // ISO timestamp
}
