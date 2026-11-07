create type issue_priority as enum ('LOW', 'NORMAL', 'URGENT');
create type issue_status as enum
  ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'REJECTED', 'MERGED');

create table issues (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  category_id uuid not null references categories(id),
  reporter_id uuid not null references profiles(id) default auth.uid(),
  assignee_id uuid references profiles(id),
  merged_into_id uuid references issues(id),
  title text not null check (length(btrim(title)) between 1 and 100),
  description text not null check (length(btrim(description)) > 0 and length(description) <= 3000),
  location text not null check (length(btrim(location)) between 1 and 50),
  photo_path text,   -- priprava za nalaganje slik (Storage), zaenkrat vedno null
  priority issue_priority not null default 'NORMAL',
  status issue_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  check ((status = 'MERGED') = (merged_into_id is not null))
);

create index on issues (building_id, status, created_at desc);

create function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger issues_updated_at before update on issues
  for each row execute function set_updated_at();

-- Začetne kategorije (v migraciji, da jih dobi tudi produkcija)
insert into categories (name) values
  ('Elektrika'), ('Voda in vodovod'), ('Ogrevanje'), ('Dvigalo'),
  ('Skupni prostori'), ('Čiščenje'), ('Drugo')
on conflict (name) do nothing;

-- Branje: sprejeti stanovalci in upravnik tega bloka
create function can_read_issues(b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where building_id = b and user_id = auth.uid()
      and status = 'APPROVED' and role in ('RESIDENT', 'MANAGER'))
$$;

alter table issues enable row level security;
create policy "prijave: branje" on issues for select to authenticated
  using (can_read_issues(building_id));
-- insert/update/delete politik ni: pisanje gre samo prek funkcij

-- US-03: oddaja prijave
create function create_issue(
  p_building uuid, p_category uuid, p_title text, p_description text, p_location text
) returns issues language plpgsql security definer set search_path = public as $$
declare v issues;
begin
  if auth.uid() is null then raise exception 'Niste prijavljeni'; end if;

  if not exists (
    select 1 from memberships
    where building_id = p_building and user_id = auth.uid()
      and role = 'RESIDENT' and status = 'APPROVED'
  ) then
    raise exception 'Prijavo lahko odda samo stanovalec s sprejetim članstvom' using errcode = '42501';
  end if;

  if btrim(coalesce(p_title, '')) = '' or btrim(coalesce(p_description, '')) = ''
     or btrim(coalesce(p_location, '')) = '' or p_category is null then
    raise exception 'Izpolnite vse obvezne podatke';
  end if;
  if length(btrim(p_title)) > 100 then raise exception 'Naslov je predolg (največ 100 znakov)'; end if;
  if length(btrim(p_location)) > 50 then raise exception 'Lokacija je predolga (največ 50 znakov)'; end if;
  if cardinality(regexp_split_to_array(btrim(p_description), '\s+')) > 300 then
    raise exception 'Opis ima lahko največ 300 besed';
  end if;
  if not exists (select 1 from categories where id = p_category) then
    raise exception 'Kategorija ne obstaja';
  end if;

  insert into issues (building_id, category_id, title, description, location)
  values (p_building, p_category, btrim(p_title), btrim(p_description), btrim(p_location))
  returning * into v;   -- status NEW, prioriteta NORMAL, prijavitelj in čas iz privzetih vrednosti
  return v;
end $$;

revoke execute on function create_issue(uuid, uuid, text, text, text) from public, anon;
grant  execute on function create_issue(uuid, uuid, text, text, text) to authenticated;