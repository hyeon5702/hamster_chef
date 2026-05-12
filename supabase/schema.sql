create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.game_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sound_enabled boolean not null default true,
  music_volume double precision not null default 0.6,
  effects_volume double precision not null default 0.85,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  day integer not null default 0,
  coins integer not null default 12,
  reputation integer not null default 0,
  inventory jsonb not null default '{}'::jsonb,
  recipe_records jsonb not null default '{}'::jsonb,
  upgrades jsonb not null default '{}'::jsonb,
  active_day jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  day integer not null,
  won boolean not null default false,
  event text not null default '',
  completed integer not null default 0,
  total integer not null default 0,
  best_score integer not null default 0,
  coins integer not null default 0,
  reputation integer not null default 0,
  dishes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, day)
);

alter table public.profiles enable row level security;
alter table public.game_settings enable row level security;
alter table public.game_saves enable row level security;
alter table public.service_history enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "settings_select_own" on public.game_settings;
drop policy if exists "settings_insert_own" on public.game_settings;
drop policy if exists "settings_update_own" on public.game_settings;
drop policy if exists "saves_select_own" on public.game_saves;
drop policy if exists "saves_insert_own" on public.game_saves;
drop policy if exists "saves_update_own" on public.game_saves;
drop policy if exists "history_select_own" on public.service_history;
drop policy if exists "history_insert_own" on public.service_history;
drop policy if exists "history_update_own" on public.service_history;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "settings_select_own"
on public.game_settings
for select
to authenticated
using (auth.uid() = user_id);

create policy "settings_insert_own"
on public.game_settings
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "settings_update_own"
on public.game_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "saves_select_own"
on public.game_saves
for select
to authenticated
using (auth.uid() = user_id);

create policy "saves_insert_own"
on public.game_saves
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "saves_update_own"
on public.game_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "history_select_own"
on public.service_history
for select
to authenticated
using (auth.uid() = user_id);

create policy "history_insert_own"
on public.service_history
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "history_update_own"
on public.service_history
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
