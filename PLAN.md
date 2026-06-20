# Yana's Summer Maths — Web App Plan

A single-page, gamified calendar that tracks Yana's summer maths, deployed static on Vercel, with progress saved to the **cloud** (synced across browsers & machines).

---

## 1. Goals & constraints
- **One home page**, no routing/nav — the calendar *is* the app.
- **Next.js + Tailwind CSS**, deployable as a **static export** to Vercel.
- **Clickable days** → open that day's tasks → mark done.
- **Gamification** + **clear progress** indicators.
- **Persistence that is NOT localStorage** — preserved across browsers/machines → needs a tiny hosted database.
- Stunning, **kid-friendly-but-polished** visuals + tasteful animations.

## 2. The "static but cross-device" solution
A static page can't run its own server, but it **can** talk to a hosted database from the browser. Recommended:

- **Supabase** (free tier, Postgres + auto REST API). The browser uses the public **anon key** (safe to ship in a static bundle) protected by a Row-Level-Security policy.
- Since it's just for Yana, **no login**: the whole app shares **one row** (`id = 'yana'`) holding a JSON blob of progress. Any device reading that row sees the same state. Optional **realtime** subscription = two devices stay in sync live.
- **Offline-resilient:** writes also cache to `localStorage` and re-sync when back online (localStorage as a *cache*, Supabase as the *source of truth*).
- Optional light **edit-PIN** so a random visitor can view but not tamper.

> Alternatives if you prefer: **Firebase Firestore** (same idea, Google account) or, if you're OK dropping "fully static" and using Vercel serverless, **Vercel KV/Postgres** (keys hidden server-side). Default plan = Supabase.

## 3. Tech stack
| Concern | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript), `output: 'export'` (static) |
| Styling | Tailwind CSS + CSS vars for the clay theme |
| Animation | Framer Motion (`motion`) + `canvas-confetti` |
| Storage | `@supabase/supabase-js` (anon key) + localStorage cache |
| Icons | `lucide-react` (SVG, no emoji-as-icon) |
| Fonts | **Baloo 2** (display) + **Nunito** (body) via `next/font` |

## 4. Design system (from the design skill)
- **Style:** **Claymorphism** — soft 3D, chunky, thick borders, double (inner+outer) soft shadows, rounded 16–24px, springy press.
- **Palette:** Primary indigo `#2563EB`, secondary blue `#3B82F6`, energetic orange CTA `#F97316`, bg `#F8FAFC`, text `#1E293B`. Difficulty accents: easy = mint/green, hard = indigo, mixed = purple, test = gold, free = soft gray; trips get their own ribbon (Sea = teal wave, Mountain = stone, Valencia = sky/plane).
- **Type:** Baloo 2 headings + Nunito body (polished, not babyish).
- **Accessibility:** keep 4.5:1 contrast, focus rings, `prefers-reduced-motion`, ≥44px tap targets, color never the *only* signal (icon + label too).

## 5. Screen layout (one page)
```
┌────────────────────────────────────────────┐
│ HERO HUD: mascot + level · big progress ring │  ← sticky-ish header
│ stars · streak · XP · this-week chips        │
├────────────────────────────────────────────┤
│ ACHIEVEMENTS shelf (badges, locked/unlocked) │
├────────────────────────────────────────────┤
│ JUNE   — weekday row + clay day-cells grid   │
│ JULY   — …                                   │
│ AUGUST — …                                   │
├────────────────────────────────────────────┤
│ footer: gentle note + reset/settings         │
└────────────────────────────────────────────┘
Click a day → DayModal (scales out of the cell).
```
- **Responsive:** desktop = roomy 7-col grids; mobile = same grid, bigger cells, HUD collapses to a compact bar. Mobile-first.

## 6. Key components
- `HeroHUD` — kitten mascot (evolves by level), big **progress ring**, animated counters (stars/XP/streak).
- `AchievementShelf` — badge chips (earned vs locked + hint).
- `MonthSection` ×3 — title, weekday header, grid.
- `DayCell` — date, difficulty tag, trip icon, done state; hover-lift, tap-scale; `aria` labelled.
- `DayModal` — date, home/trip, difficulty, the task list (`p.61 #7–11`…), per-task checkboxes + "Mark day done", confetti on complete.
- `MascotAvatar`, `ConfettiLayer`, `Toast` (badge unlocks), `SyncBadge` (cloud-synced / offline).

## 7. Gamification design
- **Stars** = 1 per completed day (73 total). **XP** = sum of task counts done (~515 total). **Level** = XP thresholds; mascot evolves: 🥚 egg → kitten → cool cat → 🎓 maths-champion cat.
- **Streak** = consecutive days completed; **free/trip-rest days don't break it** (auto-counted). Flame indicator.
- **Progress** = overall % (days and tasks), plus a per-month ring.
- **Badges:** finish each Week, finish each Month, "Beat the July Hump", "Trip Trooper" (all trip-day tasks), "Test Ace" (all 6 tests), "Perfect Streak" (7/14/30 days), "Champion" (100%).
- Daily **"Today" highlight** + a nudge ("3 tasks today — you've got this!").

## 8. Animations plan (Framer Motion; all respect reduced-motion)
- Entrance: staggered reveal of HUD → months → cells (30–50ms stagger).
- DayCell: hover lift + soft shadow; tap scale 0.96 (spring).
- Mark done: stamp ✓ + **confetti**, star/XP **count-up**, progress ring **fills**, mascot **bounces**.
- Modal: scale+fade **from the clicked cell** (spatial continuity); exit faster than enter.
- Badge unlock: toast pop + shimmer.

## 9. Data model
- **Calendar (static):** port `days.json` → `lib/calendarData.ts` (typed: date, dow, month, period, trip, type, items[{page,range,n,diff}], diff, label).
- **Progress (cloud):** one Supabase row
```json
{ "id":"yana",
  "completedDays": { "2026-07-05": true, ... },
  "completedTasks": { "2026-07-05": ["p.61 #7–11", ...] },
  "stars": 12, "xp": 137, "badges": ["week-1","june"],
  "updatedAt": "..." }
```
Derived stats (level, streak, %) computed client-side from this.

## 10. Build phases
1. **Scaffold** — create-next-app (TS, Tailwind, App Router) in this folder; add framer-motion, canvas-confetti, lucide-react, supabase-js; wire fonts; move existing print files into `reference/` to keep root clean.
2. **Data** — port `days.json` + types + derived helpers.
3. **UI (static state)** — HUD, months, cells, modal, fully styled (Claymorphism). Mobile + desktop.
4. **Animations** — entrance, interactions, confetti, count-ups.
5. **Gamification** — stars/xp/level/streak/badges logic + a `useProgress` hook (React state).
6. **Persistence** — Supabase client, load-on-mount, optimistic write + debounce, localStorage cache, optional realtime; SyncBadge.
7. **Polish** — a11y pass, reduced-motion, responsive 375/768/1024/1440, empty/loading states.
8. **Ship** — `next build` static export, Vercel deploy, env vars (`NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`), short README.

## 11. Deployment
- `git init` → push to GitHub → import in Vercel (or `vercel` CLI). Framework auto-detected; static export served on the CDN.
- Set the two `NEXT_PUBLIC_SUPABASE_*` env vars in Vercel.
- One-time Supabase setup: create project → run a tiny SQL snippet (1 table + RLS policy) → seed the `yana` row. I'll provide the exact SQL.

## 12. Open decisions (need your call)
- **Storage backend:** Supabase (default) / Firebase / build local-first now & add cloud later.
- **Edit lock:** open (anyone with the link can tick) vs a simple shared PIN.
- **Look & feel:** Claymorphism (recommended) vs an alternative vibe.
