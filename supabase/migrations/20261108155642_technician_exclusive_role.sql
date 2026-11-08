create function forbid_technician_conflicts() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'memberships' then
    if new.role in ('RESIDENT', 'MANAGER')
       and exists (select 1 from memberships where user_id = new.user_id and role = 'TECHNICIAN') then
      raise exception 'Serviser ne more biti stanovalec ali upravnik' using errcode = '23505';
    end if;
  elsif exists (select 1 from memberships where user_id = new.requested_by and role = 'TECHNICIAN') then
    raise exception 'Serviser ne more zahtevati bloka' using errcode = '23505';
  end if;
  return new;
end $$;

create trigger memberships_no_technician_conflict before insert on memberships
  for each row execute function forbid_technician_conflicts();
create trigger buildings_no_technician_conflict before insert on buildings
  for each row execute function forbid_technician_conflicts();