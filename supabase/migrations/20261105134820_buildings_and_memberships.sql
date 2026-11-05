create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end $$;

create type approval_status as enum ('PENDING', 'APPROVED', 'REJECTED');
create type member_role as enum ('MANAGER', 'RESIDENT', 'TECHNICIAN');

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  address text not null check (length(btrim(address)) > 0),
  status approval_status not null default 'PENDING',
  invite_code text unique,
  requested_by uuid not null references profiles(id) default auth.uid(),
  created_at timestamptz not null default now(),
  check ((status = 'APPROVED') = (invite_code is not null))
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  building_id uuid not null references buildings(id) on delete cascade,
  role member_role not null,
  status approval_status not null default 'PENDING',
  apartment text,
  category_id uuid references categories(id),
  created_at timestamptz not null default now(),
  unique (user_id, building_id),
  check (role <> 'RESIDENT' or length(btrim(apartment)) > 0)
);

create index on buildings (status, created_at desc);
create index on memberships (building_id, status, created_at desc);

-- Pomožne funkcije 
create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false)
$$;

create function is_manager_of(b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where building_id = b and user_id = auth.uid()
      and role = 'MANAGER' and status = 'APPROVED')
$$;

-- RLS: samo branje.
alter table categories  enable row level security;
alter table buildings   enable row level security;
alter table memberships enable row level security;

create policy "kategorije: vsi prijavljeni" on categories for select to authenticated using (true);

create policy "bloki: branje" on buildings for select to authenticated using (
  is_admin()
  or requested_by = auth.uid()
  or exists (select 1 from memberships m
             where m.building_id = buildings.id and m.user_id = auth.uid())
);

create policy "članstva: branje" on memberships for select to authenticated using (
  user_id = auth.uid() or is_admin() or is_manager_of(building_id)
);

drop policy "profil: lasten" on profiles;
create policy "profil: branje" on profiles for select to authenticated using (
  id = auth.uid()
  or is_admin()
  or exists (select 1 from memberships m
             where m.user_id = profiles.id and is_manager_of(m.building_id))
);

-- US-01: zahtevek za blok
create function request_building(p_name text, p_address text)
returns buildings language plpgsql security definer set search_path = public as $$
declare v buildings;
begin
  if auth.uid() is null then raise exception 'Niste prijavljeni'; end if;
  insert into buildings (name, address, requested_by)
  values (btrim(p_name), btrim(p_address), auth.uid())
  returning * into v;
  return v;
end $$;

-- US-01: odobritev ali zavrnitev (administrator)
create function review_building(p_building uuid, p_approve boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v buildings; v_code text;
begin
  if not is_admin() then raise exception 'Samo administrator' using errcode = '42501'; end if;
  select * into v from buildings where id = p_building for update;
  if not found then raise exception 'Blok ne obstaja'; end if;
  if v.status <> 'PENDING' then raise exception 'Zahtevek je že obravnavan'; end if;

  if p_approve then
    loop
      v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
      exit when not exists (select 1 from buildings where invite_code = v_code);
    end loop;
    update buildings set status = 'APPROVED', invite_code = v_code where id = p_building;
    insert into memberships (user_id, building_id, role, status)
    values (v.requested_by, p_building, 'MANAGER', 'APPROVED');
  else
    update buildings set status = 'REJECTED' where id = p_building;
  end if;
end $$;

-- US-02: pridružitev s kodo
create function join_building(p_code text, p_apartment text)
returns memberships language plpgsql security definer set search_path = public as $$
declare v buildings; m memberships;
begin
  if auth.uid() is null then raise exception 'Niste prijavljeni'; end if;
  select * into v from buildings
   where invite_code = upper(btrim(p_code)) and status = 'APPROVED';
  if not found then raise exception 'Koda bloka ne obstaja' using errcode = 'P0002'; end if;

  select * into m from memberships
   where user_id = auth.uid() and building_id = v.id for update;
  if found then
    if m.status in ('PENDING', 'APPROVED') then
      raise exception 'Za ta blok že imate zahtevek' using errcode = '23505';
    end if;
    -- prejšnji zahtevek je bil zavrnjen: ponovna oddaja
    update memberships set status = 'PENDING', apartment = btrim(p_apartment), created_at = now()
     where id = m.id returning * into m;
  else
    insert into memberships (user_id, building_id, role, apartment)
    values (auth.uid(), v.id, 'RESIDENT', btrim(p_apartment))
    returning * into m;
  end if;
  return m;
end $$;

-- US-02: upravnik sprejme ali zavrne
create function review_membership(p_membership uuid, p_approve boolean)
returns void language plpgsql security definer set search_path = public as $$
declare m memberships;
begin
  select * into m from memberships where id = p_membership for update;
  if not found then raise exception 'Zahtevek ne obstaja'; end if;
  if not is_manager_of(m.building_id) then
    raise exception 'Samo upravnik bloka' using errcode = '42501';
  end if;
  if m.status <> 'PENDING' then raise exception 'Zahtevek je že obravnavan'; end if;
  update memberships
     set status = case when p_approve then 'APPROVED'::approval_status else 'REJECTED'::approval_status end
   where id = p_membership;
end $$;

-- Samo prijavljeni smejo klicati
revoke execute on function request_building(text, text)   from public, anon;
revoke execute on function review_building(uuid, boolean) from public, anon;
revoke execute on function join_building(text, text)      from public, anon;
revoke execute on function review_membership(uuid, boolean) from public, anon;
grant  execute on function request_building(text, text), review_building(uuid, boolean),
                           join_building(text, text), review_membership(uuid, boolean)
  to authenticated;