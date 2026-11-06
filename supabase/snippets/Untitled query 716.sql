   insert into buildings (name, address, requested_by)
   select 'Test ' || g, 'Ulica ' || g, '4f08cc51-dad7-4314-a02a-c4f54519684e' from generate_series(1,12) g;