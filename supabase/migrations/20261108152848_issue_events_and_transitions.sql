create table issue_events (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  actor_id uuid not null references profiles(id),
  from_status issue_status,               -- null pri ustvarjanju prijave
  to_status issue_status not null,
  note text check (note is null or length(note) <= 1000),
  created_at timestamptz not null default now()
);
create index on issue_events (issue_id, created_at);

-- Dogodke vidi, kdor vidi prijavo (RLS na issues se uporabi tudi v podpoizvedbi)
alter table issue_events enable row level security;
create policy "dogodki: branje" on issue_events for select to authenticated
  using (exists (select 1 from issues i where i.id = issue_events.issue_id));

-- AC4: odjemalec ne more pisati v tabeli, status se spreminja samo prek funkcij
revoke insert, update, delete on issues from anon, authenticated;
revoke insert, update, delete on issue_events from anon, authenticated;

-- Začetni dogodek ob novi prijavi
create function log_issue_created() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into issue_events (issue_id, actor_id, from_status, to_status)
  values (new.id, new.reporter_id, null, new.status);
  return new;
end $$;

create trigger issues_log_created after insert on issues
  for each row execute function log_issue_created();

-- Zapolnitev za prijave, ki so nastale pred to migracijo (razvojni podatki)
insert into issue_events (issue_id, actor_id, from_status, to_status, created_at)
select id, reporter_id, null, 'NEW', created_at from issues;

insert into issue_events (issue_id, actor_id, from_status, to_status, created_at)
select i.id,
       coalesce((select m.user_id from memberships m
                 where m.building_id = i.building_id and m.role = 'MANAGER' and m.status = 'APPROVED'
                 limit 1), i.reporter_id),
       'NEW', i.status, i.updated_at
from issues i where i.status <> 'NEW';

-- AC1, AC2, AC3, AC5: nadzorovan prehod statusa
create function transition_issue(p_issue uuid, p_to issue_status, p_note text default null)
returns issues language plpgsql security definer set search_path = public as $$
declare
  v issues;
  v_from issue_status;
  v_manager boolean;
  v_tech boolean;
  v_required text;
  v_note text := nullif(btrim(coalesce(p_note, '')), '');
begin
  if auth.uid() is null then raise exception 'Niste prijavljeni' using errcode = '42501'; end if;

  select * into v from issues where id = p_issue for update;
  if not found then raise exception 'Prijava ne obstaja'; end if;

  v_manager := is_manager_of(v.building_id);
  v_tech := v.assignee_id = auth.uid();
  if not (v_manager or v_tech) then
    raise exception 'Nimate dostopa do te prijave' using errcode = '42501';
  end if;

  -- kdo sme izvesti prehod (NEW → ASSIGNED gre prek triage_issue, ker potrebuje serviserja)
  v_required := case
    when v.status = 'NEW'         and p_to = 'REJECTED'                    then 'manager'
    when v.status = 'ASSIGNED'    and p_to in ('IN_PROGRESS', 'NEW')       then 'technician'
    when v.status = 'IN_PROGRESS' and p_to = 'RESOLVED'                    then 'technician'
    when v.status = 'RESOLVED'    and p_to in ('CLOSED', 'REOPENED')       then 'manager'
    else null end;

  if v_required is null then
    raise exception 'Prehod % → % ni dovoljen', v.status, p_to using errcode = '22023';
  end if;
  if (v_required = 'manager' and not v_manager) or (v_required = 'technician' and not v_tech) then
    raise exception 'Vaša vloga ne sme izvesti tega prehoda' using errcode = '42501';
  end if;

  -- razlog je obvezen pri zavrnitvi, vrnitvi v triažo in ponovnem odprtju
  if v_note is null and (p_to in ('REJECTED', 'REOPENED') or (v.status = 'ASSIGNED' and p_to = 'NEW')) then
    raise exception 'Razlog je obvezen' using errcode = '23502';
  end if;
  if length(v_note) > 1000 then
    raise exception 'Razlog je predolg (največ 1000 znakov)' using errcode = '22001';
  end if;

  v_from := v.status;
  update issues
     set status = p_to,
         assignee_id = case when v_from = 'ASSIGNED' and p_to = 'NEW' then null else assignee_id end,
         resolved_at = case when p_to = 'RESOLVED' then now()
                            when p_to = 'REOPENED' then null
                            else resolved_at end
   where id = p_issue
   returning * into v;

  insert into issue_events (issue_id, actor_id, from_status, to_status, note)
  values (p_issue, auth.uid(), v_from, p_to, v_note);

  return v;
end $$;

-- Dopolnitev iz US-04: tudi dodelitev gre v zgodovino
create or replace function triage_issue(p_issue uuid, p_priority issue_priority, p_assignee uuid)
returns issues language plpgsql security definer set search_path = public as $$
declare v issues; v_from issue_status;
begin
  select * into v from issues where id = p_issue for update;
  if not found then raise exception 'Prijava ne obstaja'; end if;

  if not is_manager_of(v.building_id) then
    raise exception 'Prijavo lahko obravnava samo upravnik njenega bloka' using errcode = '42501';
  end if;
  if v.status not in ('NEW', 'REOPENED') then
    raise exception 'Prijava ni več v fazi triaže';
  end if;
  if p_priority is null then raise exception 'Izberite prioriteto'; end if;

  if not exists (
    select 1 from memberships
    where building_id = v.building_id and user_id = p_assignee
      and role = 'TECHNICIAN' and status = 'APPROVED' and category_id = v.category_id
  ) then
    raise exception 'Izbrani serviser ni serviser prave stroke v tem bloku';
  end if;

  v_from := v.status;
  update issues
     set priority = p_priority, assignee_id = p_assignee, status = 'ASSIGNED'
   where id = p_issue
   returning * into v;

  insert into issue_events (issue_id, actor_id, from_status, to_status)
  values (p_issue, auth.uid(), v_from, 'ASSIGNED');

  return v;
end $$;

revoke execute on function transition_issue(uuid, issue_status, text) from public, anon;
grant  execute on function transition_issue(uuid, issue_status, text) to authenticated;