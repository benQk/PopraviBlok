begin;
set local role authenticated;
select set_config('request.jwt.claims',
  json_build_object('sub', 'ba376df6-81ec-415c-956c-df55cd67c2ab', 'role', 'authenticated')::text, true);
select create_issue('1a19bccf-9e39-4c48-9c50-26221439f19d', (select id from categories limit 1), 'Test', 'Opis', 'Klet');
rollback;