begin;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), nullif(split_part(new.email, '@', 1), ''), 'LE FUSIL Member'),
    coalesce(new.email, new.id::text || '@account.invalid')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

insert into public.profiles (id, display_name, email)
select
  users.id,
  coalesce(nullif(btrim(users.raw_user_meta_data ->> 'display_name'), ''), nullif(split_part(users.email, '@', 1), ''), 'LE FUSIL Member'),
  coalesce(users.email, users.id::text || '@account.invalid')
from auth.users as users
on conflict (id) do nothing;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

commit;
