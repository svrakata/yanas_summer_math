# Project log — decisions & history

A running record of what was built and why, plus the data corrections (the schedule was read from a
handwritten note, so several values were fixed along the way). Newest first.

## Travel days (Jul 4, 19, 22, 29 · Aug 2, 11, 18)
These dates are **in transit** — no maths possible. They render as a `travel` day-state
(terracotta, ✈️ "on the road", marked done like a free day) and keep their trip tag if any.
Any tasks on them are **pulled and redistributed** across the remaining task days of the same period,
keeping each task's original easy/medium/hard difficulty — the other days just scale up to absorb them
(`TRAVEL` set in `gen_final.py`; days are excluded from `light_days`/`home_days`). Total stays 358.
(July's four already carried tasks → 18 redistributed; August's three were already empty → relabel only.)

## Data correction — p.13 (was p.12)
June tasks **#125–139** were tagged page **12**; corrected to page **13** in `gen_final.py`.

## Schedule — current source of truth

5 fortnightly periods, **358 tasks + 6 tests**, inclusive ranges (`end − start + 1`).

| Period | Dates | Pages & ranges | Tasks |
|---|---|---|---|
| 1 | Jun 20–30 | p.8 #47–88 · p.13 #125–149 · p.16 #164–196 | 100 |
| 2 | Jul 1–15 | p.23 #59–65 · p.26 #101,105,107,108,109,110 · p.35 #12–51 · p.40 #57–99 · p.61 #7–16 | 106 |
| 3 | Jul 16–31 | p.64 #34–55 · p.68 #84–113 · p.71 #129–150 | 74 |
| 4 | Aug 1–15 | p.82 #239–253 · p.86 #275–290 · p.92 #18–42 | 56 |
| 5 | Aug 16–31 | p.97 #82–86 · p.102 #5–21 · p.172 tests 21–26 | 22 + 6 tests |

Holidays: 🌊 Sea 4–11 Jul · ⛰️ Mountain 19–22 Jul & 29 Jul–2 Aug · ✈️ Valencia **11–15 Aug (free)**.

## Key decisions
- **Storage:** Supabase (cross-device), one shared row, **no login / fully open** (private family link).
- **Look:** Claymorphism, pastel palette, Baloo 2 + Nunito.
- **Day difficulty = workload, not task type** (see below). 1–4 tasks easy / 5–7 medium / 8+ hard.
- **Distribution:** light tasks (by classified signature) go on trip days; harder tasks on home days;
  Valencia days are fully free.

## Data corrections (note was hand-read; these were fixed)
- **p.92** read as `183–423` → corrected to **`18–42`** (25 tasks).
- **p.61** read as `7–163` (157 tasks!) → corrected to **`7–16`** (10 tasks). The "163" was "16 зад"
  (Cyrillic *з* ≈ 3). This single fix dropped the total from a bloated ~515 to **358** and erased a
  phantom "July bottleneck".
- **p.86** read as `275–291` → corrected to **`275–290`** (16 tasks).
- **Valencia trip** changed from 11–17 Aug to **11–15 Aug, all free**; 16–17 Aug became home days.

## Timeline (git history)
- `01eb03a` — Built the app: gamified Next.js calendar (stars/XP/levels/streak/badges, evolving
  kitten mascot, confetti), Claymorphism, Supabase + localStorage, static export.
- `3f83976` — Supabase **publishable** key support + key-safety docs (never ship the secret key).
- `bc56d3b` — Mobile redesign: compact day cells, fixed container padding (the `.safe-x` bug that
  zeroed mobile padding), iPhone 16 Pro hardening.
- `103215d` — **Final data (358 tasks)** regenerated via `scripts/gen_final.py`; per-task type added
  (expression/textual) with type icons.
- `8ef4d7c` — Replaced type icons with **location icons** (home/sea/mountain/valencia) paired with the
  day count; pastel palette with hard(blue)/medium(purple) made distinct.
- `1d36f7b` — **Day difficulty now derives from task count** (workload), not task signature;
  renamed the "mixed" day category to "medium".

## Things tried and reverted
- **Task-type icons (calculator = expression, book = word-problem)** on each day + a legend in the
  modal — removed as confusing; replaced with **location icons**. The per-task `type` data is still in
  `days.json` (unused by the UI) in case it's wanted later.
- Earlier the schedule **spread tasks across period boundaries** to flatten a (mis-read) July
  bottleneck; once p.61 was corrected the bottleneck vanished and the generator confines tasks to
  their own period, holiday-aware.

## Known stale artifacts
- `reference/` (gitignored) holds the original print PDFs/HTML and the task photos. The print
  calendar/`SCHEDULE.md`/`TASK_DIFFICULTY.md` there reflect **old** counts (506/515) — the app
  (`data/days.json`) is the source of truth now. Regenerate the print version from current data if
  a paper copy is needed.
