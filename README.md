# 🐾 Yana's Summer Maths Adventure

A playful, gamified summer-maths tracker. One page, a 3-month calendar (June–August 2026,
73 days). Tap a day to see its tasks, tick them off, earn stars & XP, grow your kitten from
egg → champion, keep a streak, and unlock badges. Built to print-calendar parity with the
paper version, but alive.

- **Stack:** Next.js 16 (static export) · Tailwind CSS v4 · Framer Motion · Supabase · lucide-react
- **Style:** Claymorphism (soft-3D, chunky, springy), Baloo 2 + Nunito.
- **Storage:** Supabase (syncs across browsers & machines). Falls back to on-device
  `localStorage` automatically if no keys are set.

## Run locally
```bash
npm install
npm run dev          # http://localhost:3000
```
Without Supabase keys it runs in **on-device** mode (progress saved in that browser only).

## Cross-device sync (Supabase) — optional but recommended
1. Create a free project at <https://supabase.com>.
2. **SQL Editor → New query**, paste **`supabase/setup.sql`**, Run. (Creates one `progress`
   table + a single shared `yana` row + open read/write policy. No login needed.)
3. **Settings → API**, copy the **Project URL** and the **anon public** key.
4. Put them in `.env.local` (copy from `.env.local.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. (Optional live multi-device sync) **Database → Replication** → add `progress`.

The anon key is **safe to ship** in a static site — Row Level Security limits it to that one row.

## Deploy to Vercel (static)
```bash
npm run build        # outputs ./out  (output: 'export')
```
- Push this folder to GitHub → **Import** in Vercel (framework auto-detected: Next.js).
- In Vercel **Project → Settings → Environment Variables**, add the two
  `NEXT_PUBLIC_SUPABASE_*` vars, then deploy.
- Or one-shot: `npx vercel --prod`.

> It's a fully static export, so it also works on Netlify, GitHub Pages, or any static host —
> the browser talks to Supabase directly.

## How progress is stored
A single row `progress(id='yana')` holds JSON:
```json
{ "tasks": { "2026-07-05": [0,1,2] }, "freeDone": { "2026-07-30": true }, "updatedAt": "…" }
```
- `tasks[date]` = indices of completed task-items that day.
- `freeDone[date]` = a "rest/free" day marked done.
- Stars, XP, level, streak, %, badges are all **derived** from this client-side
  (`lib/gamification.ts`). Writes are optimistic + debounced, cached to localStorage, and
  re-synced when back online.

## Project map
```
app/            layout (fonts/theme) + page.tsx (the whole UI)
components/      HeroHud, Mascot, ProgressRing, Counter, AchievementShelf,
                 MonthSection, DayCell, DayModal, SyncBadge, TripIcon
lib/             calendarData, types, dayStyle, gamification, confetti,
                 supabase, storage, useProgress
data/days.json   the schedule (73 days, tasks per day, easy/hard tags, trips)
supabase/setup.sql   one-time DB setup
reference/       the original print PDFs/HTML + task photos (gitignored)
```

## Editing the schedule
`data/days.json` is the source of truth (generated earlier from the task photos). Edit task
ranges/difficulty there and rebuild. Each day: `{ date, dow, dom, month, mi, period, trip,
type, items:[{p,r,n,d}], count, diff, label }`.
