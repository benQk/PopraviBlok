do $$
declare
  adm uuid := (select id from profiles where is_admin limit 1);
  res uuid := '4f08cc51-dad7-4314-a02a-c4f54519684e';
  b buildings; m memberships; code text;
begin
  set local role authenticated;

  -- US-01: prosilec odda zahtevek
  perform set_config('request.jwt.claims', json_build_object('sub', adm, 'role', 'authenticated')::text, true);
  b := request_building('Test blok', 'Ulica 1');
  assert b.status = 'PENDING' and b.invite_code is null, 'zahtevek mora biti PENDING brez kode';

  -- US-01: admin odobri
  perform review_building(b.id, true);
  select invite_code into code from buildings where id = b.id;
  assert length(code) >= 8, 'koda mora imeti vsaj 8 znakov';
  assert exists (select 1 from memberships
                 where building_id = b.id and user_id = adm and role = 'MANAGER' and status = 'APPROVED'),
         'prosilec mora postati MANAGER';

  -- US-02: stanovalec
  perform set_config('request.jwt.claims', json_build_object('sub', res, 'role', 'authenticated')::text, true);
  begin
    perform join_building('NEOBSTAJA', '1');
    raise exception 'neveljavna koda ni bila zavrnjena';
  exception when sqlstate 'P0002' then null;
  end;

  m := join_building(code, '12');
  assert m.status = 'PENDING' and m.role = 'RESIDENT', 'članstvo mora biti RESIDENT / PENDING';

  begin
    perform join_building(code, '12');
    raise exception 'dvojni zahtevek ni bil zavrnjen';
  exception when sqlstate '23505' then null;
  end;

  -- US-02: upravnik sprejme
  perform set_config('request.jwt.claims', json_build_object('sub', adm, 'role', 'authenticated')::text, true);
  perform review_membership(m.id, true);
  assert (select status from memberships where id = m.id) = 'APPROVED';

  raise exception 'TEST OK (razveljavljeno)';
end $$;