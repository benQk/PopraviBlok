do $$
declare
  mgr  uuid := '11e55946-913b-4cfb-bdab-158979ccbd74';
  tech uuid := '463bdf47-4fba-406e-8bd9-813e7799f43e';
  iss  uuid := '22e80e40-b713-434a-adfb-bb54cac64413';
  n int;
begin
  set local role authenticated;

  -- AC4: neposredna sprememba statusa ni mogoča
  perform set_config('request.jwt.claims', json_build_object('sub', mgr, 'role', 'authenticated')::text, true);
  begin
    update issues set status = 'CLOSED' where id = iss;
    raise exception 'NAPAKA: neposredni update je uspel';
  exception when insufficient_privilege then null; end;

  -- AC1: neveljaven prehod
  begin
    perform transition_issue(iss, 'CLOSED');
    raise exception 'NAPAKA: NEW → CLOSED je dovoljen';
  exception when sqlstate '22023' then null; end;

  -- AC5: zavrnitev brez razloga
  begin
    perform transition_issue(iss, 'REJECTED');
    raise exception 'NAPAKA: zavrnitev brez razloga';
  exception when sqlstate '23502' then null; end;

  perform triage_issue(iss, 'NORMAL', tech);

  -- AC2: upravnik ne sme izvesti serviserjevega prehoda
  begin
    perform transition_issue(iss, 'IN_PROGRESS');
    raise exception 'NAPAKA: upravnik je sprejel nalog namesto serviserja';
  exception when sqlstate '42501' then null; end;

  perform set_config('request.jwt.claims', json_build_object('sub', tech, 'role', 'authenticated')::text, true);
  perform transition_issue(iss, 'IN_PROGRESS');
  perform transition_issue(iss, 'RESOLVED', 'Popravljeno');

  -- AC2: serviser ne sme zapreti prijave
  begin
    perform transition_issue(iss, 'CLOSED');
    raise exception 'NAPAKA: serviser je zaprl prijavo';
  exception when sqlstate '42501' then null; end;

  perform set_config('request.jwt.claims', json_build_object('sub', mgr, 'role', 'authenticated')::text, true);
  perform transition_issue(iss, 'CLOSED');

  -- AC3: ustvarjanje + ASSIGNED + IN_PROGRESS + RESOLVED + CLOSED
  select count(*) into n from issue_events where issue_id = iss;
  assert n = 5, 'pričakovanih 5 dogodkov, dobljenih ' || n;
  assert (select status from issues where id = iss) = 'CLOSED';

  raise exception 'TEST OK (razveljavljeno)';
end $$;