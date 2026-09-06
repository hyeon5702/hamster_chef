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

-- RLS의 with check는 NEW 행만 볼 수 있어서 "원래 값이 무엇이었는지" 검사하지 못한다.
-- host_id 탈취, 참가자 덮어쓰기, 남의 방 status 조작은 트리거에서 막는다.
create or replace function public.challenge_rooms_guard()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  actor uuid := auth.uid();
begin
  -- 변경 불가 컬럼
  if new.id is distinct from old.id
     or new.room_code is distinct from old.room_code
     or new.host_id is distinct from old.host_id
     or new.created_at is distinct from old.created_at then
    raise exception 'challenge_rooms: id, room_code, host_id, created_at 은 변경할 수 없습니다';
  end if;

  -- guest 슬롯
  if new.guest_id is distinct from old.guest_id then
    if old.guest_id is null then
      -- 빈 슬롯: 본인만 참가 가능
      if new.guest_id is distinct from actor then
        raise exception 'challenge_rooms: 다른 사용자를 참가자로 넣을 수 없습니다';
      end if;
    else
      -- 이미 참가자가 있는 방: 비우는 것만 허용하고, 방장이나 본인만 가능
      if new.guest_id is not null then
        raise exception 'challenge_rooms: 이미 참가자가 있는 방입니다';
      end if;
      if actor is distinct from old.host_id and actor is distinct from old.guest_id then
        raise exception 'challenge_rooms: 참가자를 내보낼 권한이 없습니다';
      end if;
    end if;
  end if;

  -- status는 방장과 참가자만 변경 가능
  if new.status is distinct from old.status
     and actor is distinct from old.host_id
     and actor is distinct from old.guest_id then
    raise exception 'challenge_rooms: 방 상태를 변경할 권한이 없습니다';
  end if;

  -- 닉네임은 각자 본인 것만
  if new.host_nickname is distinct from old.host_nickname and actor is distinct from old.host_id then
    raise exception 'challenge_rooms: 방장 닉네임은 방장만 변경할 수 있습니다';
  end if;

  if new.guest_nickname is distinct from old.guest_nickname
     and new.guest_nickname is not null
     and actor is distinct from new.guest_id then
    raise exception 'challenge_rooms: 참가자 닉네임은 본인만 변경할 수 있습니다';
  end if;

  return new;
end;
$$;

drop trigger if exists challenge_rooms_guard_trg on public.challenge_rooms;
create trigger challenge_rooms_guard_trg
  before update on public.challenge_rooms
  for each row execute function public.challenge_rooms_guard();

drop policy if exists "rooms_select_authenticated" on public.challenge_rooms;
drop policy if exists "rooms_select_visible" on public.challenge_rooms;
drop policy if exists "rooms_insert_own" on public.challenge_rooms;
drop policy if exists "rooms_update_participants" on public.challenge_rooms;
drop policy if exists "rooms_delete_own" on public.challenge_rooms;

-- 대기 중인 방(참가용)과 본인이 속한 방만 조회 가능
create policy "rooms_select_visible"
  on public.challenge_rooms for select to authenticated
  using (status = 'waiting' or auth.uid() = host_id or auth.uid() = guest_id);

-- 방장만 방 생성 가능
create policy "rooms_insert_own"
  on public.challenge_rooms for insert to authenticated
  with check (auth.uid() = host_id);

-- 방장, 참가자, 또는 대기 중인 빈 방에 참가하려는 사용자만 수정 시도 가능.
-- guest_id is null 은 "참가하기"와 "참가자가 방을 나가기" 두 경우 모두를 허용하기 위한 것이고,
-- 실제로 어떤 컬럼을 어떻게 바꿀 수 있는지는 위 트리거가 강제한다.
create policy "rooms_update_participants"
  on public.challenge_rooms for update to authenticated
  using (
    auth.uid() = host_id
    or auth.uid() = guest_id
    or (guest_id is null and status = 'waiting')
  )
  with check (
    auth.uid() = host_id
    or auth.uid() = guest_id
    or guest_id is null
  );

-- 방장만 방 삭제 가능
create policy "rooms_delete_own"
  on public.challenge_rooms for delete to authenticated
  using (auth.uid() = host_id);
