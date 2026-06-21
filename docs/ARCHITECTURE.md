# Architecture

How Yana's Summer Maths app is put together — the data pipeline, the runtime, and the data model.

## 1. The schedule pipeline (build-time, offline)

The schedule is produced once, offline, and frozen into `data/days.json`. It is **not** computed at
runtime.

```
handwritten note (reference/fufi_summer_math_tasks.jpg)
        │  read + validated by hand → page/task ranges per period
        ▼
per-task classification (TASK_CLASSIFICATION.md)
        │  type (expression/textual) + difficulty (e/m/h), encoded as BLOCKS
        ▼
scripts/gen_final.py
        │  • assigns each task a day, holiday-aware (light tasks → trips,
        │    hard → home days, Valencia 11–15 Aug = free)
        │  • sets each DAY's difficulty from its task COUNT (1–4 easy / 5–7 medium / 8+ hard)
        ▼
data/days.json   ← single source of truth the app imports
```

To change the schedule (ranges, holidays, distribution, thresholds), edit `gen_final.py` and rerun
`python3 scripts/gen_final.py`. Don't hand-edit `days.json`.

Holidays baked into the generator: **Sea** 4–11 Jul, **Mountain** 19–22 Jul & 29 Jul–2 Aug
(light task days), **Valencia** 11–15 Aug (**free** — no tasks; she's travelling). 16–17 Aug are home.

## 2. Runtime data flow (in the browser)

```
data/days.json ──import──▶ lib/calendarData.ts (typed DAYS, META, helpers)
                                   │
        app/page.tsx ◀── useProgress() ──▶ lib/storage.ts ──▶ Supabase row 'yana'
             │                 (state)            │                + localStorage cache
             ▼                                    ▼
   components/* (HeroHud, MonthSection,    lib/gamification.ts
   DayCell, DayModal, AchievementShelf…)   (derives stars/XP/level/streak/badges
                                            from progress + DAYS — nothing stored)
```

- **The calendar (`DAYS`) is static**, shipped in the JS bundle.
- **Progress is the only mutable state**: a map of which task-items are completed per day.
- Everything gamified is *derived* — change the rules in `gamification.ts`, no migration needed.

## 3. Persistence (`lib/storage.ts`, `lib/supabase.ts`, `lib/useProgress.ts`)

- One Supabase table `progress`, one row `id = 'yana'`, holding a JSON blob. No auth — it's a private
  family link. Row Level Security limits the public key to that single row (`supabase/setup.sql`).
- `useProgress()` loads localStorage first (instant), then the cloud; if the cloud row is newer it
  wins, otherwise local is pushed up. Writes are optimistic, debounced (~600ms), cached to
  localStorage, and re-synced when back online. An optional realtime subscription keeps two open
  devices in sync.
- **No keys set → local-only mode** (the `SyncBadge` shows "On this device" vs "Synced").

### Progress shape (the Supabase blob)
```jsonc
{
  "tasks":    { "2026-07-05": [0, 1, 2] },   // dateISO → indices of completed task-items
  "freeDone": { "2026-07-30": true },        // a free/rest day ticked done
  "updatedAt": "2026-06-22T…Z"
}
```

## 4. Data model (`lib/types.ts`)

```ts
DayRec {
  date, dow, dom, month, mi,        // calendar
  period: "P1".."P5",               // the 5 fortnightly periods
  trip: "Sea"|"Mountain"|"Valencia"|null,
  type: "home"|"trip",
  items: TaskItem[],                // the tasks assigned that day
  count,                            // task total (excludes tests)
  diff: "easy"|"medium"|"hard"|"test"|"rest",   // ← from COUNT, drives the cell colour
  types: ("x"|"t")[],               // task types present (currently not shown in UI)
  label,                            // "p.40 #57-60 · p.41 #61-65"
}
TaskItem { p, r, n, d:"e"|"m"|"h", t:"x"|"t", test? }   // page, range, count, difficulty, type
```

`d` (per-task difficulty) and `t` (type) come from the classification; they steer task *placement*
in the generator but are not the source of the displayed day colour (`diff` is). `types` is retained
in the data but not currently rendered (type icons were removed as confusing — see CHANGELOG).

## 5. Components

| Component | Role |
|---|---|
| `HeroHud` | mascot (evolves by level), big progress ring, stars/streak/tasks chips |
| `Mascot` | SVG kitten, 4 stages egg→kitten→cool-cat→champion |
| `AchievementShelf` | 10 badges, earned vs locked |
| `MonthSection` ×3 | month grid (Mon-first), weekday header, responsive row heights |
| `DayCell` | one button, **two faces** (mobile compact / desktop rich) toggled by `sm:`. Shows day number, location icon + count, difficulty colour, today ring |
| `DayModal` | tasks for a day, per-task checkboxes, "mark day done", confetti on complete |
| `LocationIcon` / `TripIcon` | home / sea / mountain / valencia icons |
| `ProgressRing`, `Counter`, `SyncBadge` | small reusable bits |

## 6. Visual system

- **Style:** Claymorphism — soft-3D `.clay*` utility classes in `app/globals.css`, pastel palette,
  Baloo 2 (display) + Nunito (body) via `next/font`.
- **Difficulty colours** (`lib/dayStyle.ts`): easy = green, medium = purple, hard = blue,
  test = amber, free = slate. Trips: Sea = teal, Mountain = stone, Valencia = coral.
- **Mobile-first**, hardened for iPhone 16 Pro: safe-area insets, ≥44px tap targets, `touch-action`,
  `prefers-reduced-motion` respected, fixed-gradient backdrop (no iOS `background-attachment` bug).
