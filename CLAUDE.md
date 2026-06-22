# CLAUDE.md

Guidance for working in this repo. Keep it accurate — update it when architecture or workflows change.

## What this is
**Yana's Summer Maths Adventure** — a single-page, gamified calendar that tracks an 11-year-old's
summer maths homework (20 Jun – 31 Aug 2026, 73 days, 358 tasks + 6 tests). Static Next.js app on
Vercel; progress syncs across devices via Supabase. See `docs/ARCHITECTURE.md` for the full picture
and `docs/CHANGELOG.md` for project history & decisions.

## Stack
Next.js 16 (App Router, **static export** `output: 'export'`) · React 19 · Tailwind CSS **v4**
(CSS-first, no `tailwind.config`) · Framer Motion · lucide-react · canvas-confetti · Supabase.

## Commands
```bash
npm run dev            # dev server → http://localhost:3000
npm run build          # static export → ./out  (this is what Vercel ships)
python3 scripts/gen_final.py   # regenerate data/days.json from the schedule + classification
```
There are no tests and no lint step wired up. Verify changes by building and eyeballing the app.

## Architecture in one breath
`scripts/gen_final.py` → **`data/days.json`** (the schedule, the single source of truth for the app)
→ imported by `lib/calendarData.ts` → rendered by `app/page.tsx` + `components/*`. Progress lives in
Supabase (one shared row `id='yana'`, no login) with a localStorage cache; `lib/useProgress.ts` is the
hook that ties it together. All derived stats (stars, XP, level, streak, badges) are computed
client-side in `lib/gamification.ts` — nothing is stored but the raw completion map.

Key modules:
- `lib/types.ts` — data shapes (`DayRec`, `TaskItem`, `Progress`).
- `lib/dayStyle.ts` — the difficulty + trip colour palette (pastel). Edit here to change colours.
- `lib/storage.ts` / `lib/supabase.ts` — cloud + local persistence. `lib/useProgress.ts` — the hook.
- `components/DayCell.tsx` — has **two faces** (mobile compact + desktop rich), toggled purely by the
  `sm:` Tailwind breakpoint (CSS, no JS). Edit both faces when changing a cell.

## Important conventions & invariants
- **Fully static.** No API routes, no server components doing data fetching, no `process.env` secrets
  in the bundle. Everything that touches data is a client component / client hook.
- **Day difficulty = WORKLOAD, not task type.** A day's colour comes from its task *count*
  (1–4 easy, 5–7 medium, 8+ hard), computed in `gen_final.py`. Per-task difficulty (`d: e/m/h`) only
  decides *where* a task lands (light tasks → trip days); it is not displayed.
- **Travel days** (the `TRAVEL` set in `gen_final.py`) are in-transit days with **no tasks**: they get
  `diff="travel"`, are excluded from `light_days`/`home_days`, and their tasks redistribute onto the
  rest of the same period. They mark done via `freeDone` like a free day. `DayDiff` includes `"travel"`,
  so `DIFF` in `lib/dayStyle.ts` must keep a `travel` entry (the exhaustive Record won't compile otherwise).
- **Don't hand-edit `data/days.json`** for schedule changes — edit `scripts/gen_final.py` and rerun,
  so it stays reproducible. (Small one-off field fixes are fine if you also update the generator.)
- **Supabase keys:** only the **publishable** key (`sb_publishable_…`) ever goes client-side, in
  `.env.local` / Vercel env (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
  **Never** ship the `sb_secret_…` key. App falls back to local-only mode when env is unset.

## Gotchas (learned the hard way)
- **Never `pkill -f next` while a build is running** — it matches `next build` and kills your own
  build (shows as exit 144). Kill the dev server by port instead: `lsof -ti :3000 | xargs kill`.
- **Turbopack dev cache corrupts** sometimes (`Compaction failed` / missing `build-manifest.json`).
  Fix: `rm -rf .next && npm run dev`.
- **Testing against live Supabase leaks writes.** Opening the built app (which has the keys baked in)
  and ticking days writes to the shared `yana` row, and an open test browser can re-sync after you
  reset it. After any browser testing, reset the row and re-verify it stays empty:
  ```bash
  # upsert {tasks:{},freeDone:{},updatedAt:now} into progress where id='yana', then re-select to confirm
  ```
- **`use client` prop-serialization warnings** (Next 16 wants Server-Action naming for function props)
  are harmless here — everything is client-side; the build tolerates them. Don't rename handlers.
- Tailwind v4: theme tokens live in `app/globals.css` `@theme` blocks, not a config file. Clay
  surfaces are the `.clay` / `.clay-sm` / `.clay-pill` utility classes there.

## Deploy
Push to `main` → Vercel auto-builds the static export. Set the two `NEXT_PUBLIC_SUPABASE_*` env vars
in Vercel. One-time DB setup: run `supabase/setup.sql` in the Supabase SQL editor. Full steps in
`README.md`.
