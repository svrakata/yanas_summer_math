export type ItemDiff = "easy" | "hard" | "test";
export type DayDiff = "easy" | "hard" | "mixed" | "test" | "rest";
export type DayType = "home" | "trip";
export type Trip = "Sea" | "Mountain" | "Valencia";

export interface TaskItem {
  p: string; // page label, e.g. "61" or "8–9"
  r: string; // task range/list, e.g. "7–11"
  n: number; // number of tasks
  d: ItemDiff;
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
  label: string;
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
  updatedAt: string; // ISO timestamp
}
