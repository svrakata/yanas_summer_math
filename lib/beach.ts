/**
 * Beach Mode — Yana's seaside break. While "today" falls inside this window the
 * app greets her with a warm banner, her day-streak is *paused* (vacation days
 * count as rest, so it never breaks), and the framing softens. It's all about
 * her enjoying the holiday — nothing is late, nothing is lost.
 *
 * 👉 Set these to her real seaside dates (inclusive, yyyy-mm-dd).
 */
export const VACATION = {
  start: "2026-07-04", // Sea trip — matches the postponed Sea days in gen_final.py
  end: "2026-07-11",
};

/** True if the given day is inside the seaside break. */
export function inVacation(dateISO: string): boolean {
  return dateISO >= VACATION.start && dateISO <= VACATION.end;
}

/** True if today is a beach day → show Beach Mode. */
export function isBeachTime(todayISO: string): boolean {
  return inVacation(todayISO);
}
