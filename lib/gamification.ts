import {
  DAYS,
  TOTAL_DAYS,
  TOTAL_TASKS,
  TOTAL_TESTS,
  MONTHS,
  todayISO,
} from "./calendarData";
import type { DayRec, Progress } from "./types";
import { inVacation } from "./beach";

/* ---------- per-day helpers ---------- */
export function dayDone(d: DayRec, p: Progress): boolean {
  if (d.items.length === 0) return !!p.freeDone[d.date];
  return (p.tasks[d.date]?.length ?? 0) >= d.items.length;
}
export function dayDoneCount(d: DayRec, p: Progress): number {
  if (d.items.length === 0) return p.freeDone[d.date] ? 1 : 0;
  return p.tasks[d.date]?.length ?? 0;
}
export function dayTasksDoneN(d: DayRec, p: Progress): number {
  if (d.items.length === 0) return 0;
  const done = p.tasks[d.date] ?? [];
  // exclude the review tests from the task/XP count (counted separately)
  return done.reduce((s, idx) => s + (d.items[idx]?.test ? 0 : d.items[idx]?.n ?? 0), 0);
}

/* ---------- levels & mascot ---------- */
export const LEVELS = [
  { min: 0, name: "Sprout", stage: 0 },
  { min: 50, name: "Explorer", stage: 1 },
  { min: 140, name: "Adventurer", stage: 1 },
  { min: 250, name: "Star Pupil", stage: 2 },
  { min: 380, name: "Maths Whiz", stage: 2 },
  { min: 500, name: "Champion", stage: 3 },
];
export const MASCOT_NAMES = ["Egg", "Kitten", "Cool Cat", "Champion Cat"];

export interface Stats {
  daysDone: number;
  totalDays: number;
  tasksDone: number;
  totalTasks: number;
  testsDone: number;
  totalTests: number;
  stars: number;
  xp: number;
  level: number; // 1-based
  levelName: string;
  mascotStage: number;
  xpIntoLevel: number;
  xpForLevel: number; // span of current level (or remaining at max)
  nextLevelName: string | null;
  streak: number;
  bestStreak: number;
  pctDays: number;
  pctTasks: number;
  perMonth: { mi: number; name: string; done: number; total: number; pct: number }[];
}

export function computeStats(p: Progress): Stats {
  let daysDone = 0;
  let tasksDone = 0;
  let testsDone = 0;
  for (const d of DAYS) {
    if (dayDone(d, p)) daysDone++;
    tasksDone += dayTasksDoneN(d, p);
    const done = d.items.length ? p.tasks[d.date] ?? [] : [];
    testsDone += done.filter((idx) => d.items[idx]?.test).length;
  }
  const stars = daysDone;
  const xp = tasksDone + daysDone * 3; // tasks + small per-day bonus

  let li = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) li = i;
  const cur = LEVELS[li];
  const next = LEVELS[li + 1] ?? null;
  const xpIntoLevel = xp - cur.min;
  const xpForLevel = next ? next.min - cur.min : Math.max(1, xpIntoLevel);

  const perMonth = MONTHS.map((m) => {
    const ds = DAYS.filter((d) => d.mi === m.mi);
    const done = ds.filter((d) => dayDone(d, p)).length;
    return { mi: m.mi, name: m.name, done, total: ds.length, pct: done / ds.length };
  });

  return {
    daysDone,
    totalDays: TOTAL_DAYS,
    tasksDone,
    totalTasks: TOTAL_TASKS,
    testsDone,
    totalTests: TOTAL_TESTS,
    stars,
    xp,
    level: li + 1,
    levelName: cur.name,
    mascotStage: cur.stage,
    xpIntoLevel,
    xpForLevel,
    nextLevelName: next ? next.name : null,
    streak: computeStreak(p),
    bestStreak: longestStreak(p),
    pctDays: daysDone / TOTAL_DAYS,
    pctTasks: TOTAL_TASKS ? tasksDone / TOTAL_TASKS : 0,
    perMonth,
  };
}

/** Consecutive most-recent days (≤ today) that are done; rest/free days count automatically. */
export function computeStreak(p: Progress): number {
  const today = todayISO();
  const past = DAYS.filter((d) => d.date <= today);
  let streak = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    const d = past[i];
    // rest/free days AND seaside-break days count automatically — the streak
    // pauses over a holiday, it never breaks.
    const isRest = d.items.length === 0 || inVacation(d.date);
    if (isRest || dayDone(d, p)) streak++;
    else break;
  }
  return streak;
}

/**
 * Longest run of consecutive completed days anywhere in the calendar — the basis
 * for the streak *badges* (achievements). Unlike `computeStreak` this isn't anchored
 * to today, so an earned streak badge stays earned: completing days only grows the
 * best run, it never resets it just because today isn't ticked yet.
 * Rest/free/travel days count only when actually marked done, so an untouched
 * travel block can't hand out a streak for free.
 */
export function longestStreak(p: Progress): number {
  let best = 0;
  let run = 0;
  for (const d of DAYS) {
    if (dayDone(d, p)) {
      run++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}

/* ---------- badges ---------- */
export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string; // lucide icon key, mapped in the component
  earned: boolean;
}

function monthDone(mi: number, p: Progress) {
  return DAYS.filter((d) => d.mi === mi).every((d) => dayDone(d, p));
}

export function evalBadges(p: Progress, s: Stats): Badge[] {
  const tripTasks = DAYS.filter((d) => d.type === "trip");
  const tripDone = tripTasks.length > 0 && tripTasks.every((d) => dayDone(d, p));
  const sticky = new Set(p.badges ?? []);
  const badges: Badge[] = [
    { id: "first", name: "First Steps", desc: "Finish your first day", icon: "footprints", earned: s.daysDone >= 1 },
    { id: "fire", name: "On Fire", desc: "3-day streak", icon: "flame", earned: s.bestStreak >= 3 },
    { id: "week", name: "Week Warrior", desc: "7-day streak", icon: "swords", earned: s.bestStreak >= 7 },
    { id: "century", name: "Century", desc: "100 tasks solved", icon: "target", earned: s.tasksDone >= 100 },
    { id: "june", name: "June Hero", desc: "Finish all of June", icon: "sun", earned: monthDone(6, p) },
    { id: "july", name: "July Slayer", desc: "Beat the July hump", icon: "mountain-snow", earned: monthDone(7, p) },
    { id: "august", name: "August Ace", desc: "Finish all of August", icon: "sparkles", earned: monthDone(8, p) },
    { id: "trip", name: "Trip Trooper", desc: "All trip-day tasks done", icon: "backpack", earned: tripDone },
    { id: "tests", name: "Test Ace", desc: "Ace all 6 review tests", icon: "graduation-cap", earned: s.totalTests > 0 && s.testsDone >= s.totalTests },
    { id: "champion", name: "Champion", desc: "Finish the whole summer", icon: "crown", earned: s.daysDone >= s.totalDays },
  ];
  // Once earned, always earned: union the currently-derived status with the
  // persisted set so un-completing a day can never take a badge back.
  return badges.map((b) => (b.earned || sticky.has(b.id) ? { ...b, earned: true } : b));
}

/** Badge ids that are derived-earned right now but not yet persisted in `p.badges`. */
export function unrecordedBadges(p: Progress, s: Stats): string[] {
  const sticky = new Set(p.badges ?? []);
  return evalBadges(p, s)
    .filter((b) => b.earned && !sticky.has(b.id))
    .map((b) => b.id);
}
