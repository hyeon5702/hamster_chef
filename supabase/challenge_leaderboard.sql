create table if not exists public.challenge_leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '햄스터 셰프',
  challenge_score integer not null default 0,
  best_dish_score integer not null default 0,
  clear_time_seconds integer not null default 0,
  completed_orders integer not null default 0,
  total_orders integer not null default 0,
  day_reached integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.challenge_leaderboard enable row level security;

drop policy if exists "challenge_leaderboard_select_all" on public.challenge_leaderboard;
drop policy if exists "challenge_leaderboard_insert_own" on public.challenge_leaderboard;
drop policy if exists "challenge_leaderboard_update_own" on public.challenge_leaderboard;

create policy "challenge_leaderboard_select_all"
on public.challenge_leaderboard
for select
to authenticated
using (true);

create policy "challenge_leaderboard_insert_own"
on public.challenge_leaderboard
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "challenge_leaderboard_update_own"
on public.challenge_leaderboard
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
