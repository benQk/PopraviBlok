create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

alter table profiles enable row level security;
create policy "profil: lasten" on profiles for select using (id = auth.uid());