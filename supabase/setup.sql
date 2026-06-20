-- ============================================================
--  Yana's Summer Maths — Supabase one-time setup
--  Run this in your Supabase project: SQL Editor → New query → Run
-- ============================================================

-- 1) One table holding a single JSON blob of progress.
create table if not exists public.progress (
  id          text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 2) Seed the single shared row for Yana.
insert into public.progress (id, data)
values ('yana', '{"tasks":{},"freeDone":{},"updatedAt":"1970-01-01T00:00:00.000Z"}'::jsonb)
on conflict (id) do nothing;

-- 3) Row Level Security: allow the public (anon) key to read & write
--    ONLY this one row. No login required — fine for a private family link.
alter table public.progress enable row level security;

drop policy if exists "read yana" on public.progress;
create policy "read yana"
  on public.progress for select
  using (id = 'yana');

drop policy if exists "update yana" on public.progress;
create policy "update yana"
  on public.progress for update
  using (id = 'yana')
  with check (id = 'yana');

drop policy if exists "insert yana" on public.progress;
create policy "insert yana"
  on public.progress for insert
  with check (id = 'yana');

-- 4) (Optional) enable live sync across open devices:
--    Database → Replication → add table "progress" to the supabase_realtime publication,
--    or run:
-- alter publication supabase_realtime add table public.progress;
