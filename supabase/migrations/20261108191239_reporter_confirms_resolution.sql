create or replace function transition_issue(p_issue uuid, p_to issue_status, p_note text default null)
returns issues language plpgsql security definer set search_path = public as $$
declare
  v issues;
  v_from issue_status;
  v_manager boolean;
  v_tech boolean;
  v_reporter boolean;                       -- US-07
  v_required text;
  v_note text := nullif(btrim(coalesce(p_note, '')), '');
begin
  if auth.uid() is null then raise exception 'Niste prijavljeni' using errcode = '42501'; end if;

  select * into v from issues where id = p_issue for update;
  if not found then raise exception 'Prijava ne obstaja'; end if;

  v_manager  := is_manager_of(v.building_id);
  v_tech     := v.assignee_id = auth.uid();
  v_reporter := v.reporter_id = auth.uid();  -- US-07
  if not (v_manager or v_tech or v_reporter) then
    raise exception 'Nimate dostopa do te prijave' using errcode = '42501';
  end if;

  v_required := case
    when v.status = 'NEW'         and p_to = 'REJECTED'                    then 'manager'
    when v.status = 'ASSIGNED'    and p_to in ('IN_PROGRESS', 'NEW')       then 'technician'
    when v.status = 'IN_PROGRESS' and p_to = 'RESOLVED'                    then 'technician'
    when v.status = 'RESOLVED'    and p_to in ('CLOSED', 'REOPENED')       then 'reporter'   -- US-07
    else null end;

  if v_required is null then
    raise exception 'Prehod % → % ni dovoljen', v.status, p_to using errcode = '22023';
  end if;
  if (v_required = 'manager' and not v_manager)
     or (v_required = 'technician' and not v_tech)
     or (v_required = 'reporter' and not v_reporter) then
    raise exception 'Vaša vloga ne sme izvesti tega prehoda' using errcode = '42501';
  end if;

  if v_note is null and (p_to in ('REJECTED', 'REOPENED') or (v.status = 'ASSIGNED' and p_to = 'NEW')) then
    raise exception 'Razlog je obvezen' using errcode = '23502';
  end if;
  -- US-07 AC3: razlog zavrnitve odprave ima vsaj 10 znakov
  if p_to = 'REOPENED' and length(v_note) < 10 then
    raise exception 'Razlog mora imeti vsaj 10 znakov' using errcode = '23514';
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