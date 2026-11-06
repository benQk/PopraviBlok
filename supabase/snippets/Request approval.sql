  update buildings set status='APPROVED', invite_code='TEST123456' where id='10abd707-57fb-4555-9681-ae147be52def';
  insert into memberships (user_id, building_id, role, status)
  select requested_by, id, 'MANAGER', 'APPROVED' from buildings where id='10abd707-57fb-4555-9681-ae147be52def';