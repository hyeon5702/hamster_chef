-- PvP 멀티 챌린지 방 테이블
create table if not exists public.challenge_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  host_id uuid not null references auth.users(id) on delete cascade,
  host_nickname text not null default '햄스터 셰프',
  guest_id uuid references auth.users(id) on delete set null,
  guest_nickname text,
  status text not null default 'waiting',  -- waiting | playing | done
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.challenge_rooms enable row level security;

drop policy if exists "rooms_select_authenticated" on public.challenge_rooms;
drop policy if exists "rooms_insert_own" on public.challenge_rooms;
drop policy if exists "rooms_update_participants" on public.challenge_rooms;
drop policy if exists "rooms_delete_own" on public.challenge_rooms;

-- 모든 인증 유저가 방 조회 가능 (방 코드로 참가하기 위해)
create policy "rooms_select_authenticated"
  on public.challenge_rooms for select to authenticated using (true);

-- 방장만 방 생성 가능
create policy "rooms_insert_own"
  on public.challenge_rooms for insert to authenticated
  with check (auth.uid() = host_id);

-- 방장 또는 참가자(빈 방이면 누구나 guest로 참가) 수정 가능
create policy "rooms_update_participants"
  on public.challenge_rooms for update to authenticated
  using (auth.uid() = host_id or auth.uid() = guest_id or guest_id is null)
  with check (true);

-- 방장만 방 삭제 가능
create policy "rooms_delete_own"
  on public.challenge_rooms for delete to authenticated
  using (auth.uid() = host_id);
