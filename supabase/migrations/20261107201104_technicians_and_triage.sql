-- Serviser ima vedno stroko, ostale vloge je nimajo
alter table memberships
  add constraint technician_has_category
  check ((role = 'TECHNICIAN') = (category_id is not null));

-- Dodeljeni serviser sme prebrati svojo prijavo
drop policy "prijave: branje" on issues;
create policy "prijave: branje" on issues for select to authenticated
  using (can_read_issues(building_id) or assignee_id = auth.uid());

-- US-04 AC1: upravnik doda serviserja z e-naslovom
create function add_technician(p_building uuid, p_email text, p_category uuid)
returns memberships language plpgsql security definer set search_path = public as $$
declare v_user uuid; m memberships;
begin
  if not is_manager_of(p_building) then
    raise exception 'Samo upravnik bloka' using errcode = '42501';
  end if;
  if btrim(coalesce(p_email, '')) = '' then raise exception 'E-naslov je obvezen'; end if;
  if p_category is null or not exists (select 1 from categories where id = p_category) then
    raise exception 'Izberite stroko (kategorijo)';
  end if;

  select id into v_user from profiles where lower(email) = lower(btrim(p_email));
  if not found then
    raise exception 'Uporabnik s tem e-naslovom ni registriran' using errcode = 'P0002';
  end if;

  -- ne sme biti upravnik ali stanovalec nobenega bloka (tudi čakajoče prošnje štejejo)
  if exists (select 1 from memberships
             where user_id = v_user and role in ('MANAGER', 'RESIDENT')
               and status in ('PENDING', 'APPROVED'))
     or exists (select 1 from buildings where requested_by = v_user and status = 'PENDING') then
    raise exception 'Uporabnik je že upravnik ali stanovalec in ne more postati serviser'
      using errcode = '23505';
  end if;

  if exists (select 1 from memberships where user_id = v_user and building_id = p_building) then
    raise exception 'Za tega uporabnika v tem bloku že obstaja članstvo' using errcode = '23505';
  end if;

  insert into memberships (user_id, building_id, role, status, category_id)
  values (v_user, p_building, 'TECHNICIAN', 'APPROVED', p_category)
  returning * into m;
  return m;
end $$;

-- US-04 AC2–AC5: prioriteta in dodelitev
create function triage_issue(p_issue uuid, p_priority issue_priority, p_assignee uuid)
returns issues language plpgsql security definer set search_path = public as $$
declare v issues;
begin
  select * into v from issues where id = p_issue for update;
  if not found then raise exception 'Prijava ne obstaja'; end if;

  -- AC5: upravnik lahko obravnava samo prijave svojega bloka
  if not is_manager_of(v.building_id) then
    raise exception 'Prijavo lahko obravnava samo upravnik njenega bloka' using errcode = '42501';
  end if;
  if v.status not in ('NEW', 'REOPENED') then
    raise exception 'Prijava ni več v fazi triaže';
  end if;
  if p_priority is null then raise exception 'Izberite prioriteto'; end if;

  -- AC2: serviser tega bloka z enako stroko, kot je kategorija prijave
  if not exists (
    select 1 from memberships
    where building_id = v.building_id and user_id = p_assignee
      and role = 'TECHNICIAN' and status = 'APPROVED' and category_id = v.category_id
  ) then
    raise exception 'Izbrani serviser ni serviser prave stroke v tem bloku';
  end if;

  update issues
     set priority = p_priority, assignee_id = p_assignee, status = 'ASSIGNED'
   where id = p_issue
   returning * into v;
  return v;
end $$;

revoke execute on function add_technician(uuid, text, uuid) from public, anon;
revoke execute on function triage_issue(uuid, issue_priority, uuid) from public, anon;
grant  execute on function add_technician(uuid, text, uuid),
                           triage_issue(uuid, issue_priority, uuid) to authenticated;