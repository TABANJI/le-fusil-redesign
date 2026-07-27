begin;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (btrim(display_name) <> ''), email extensions.citext not null,
  is_active boolean not null default true, last_login_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.roles (
  id uuid primary key default extensions.gen_random_uuid(), code text not null unique,
  name text not null, description text, created_at timestamptz not null default now(),
  constraint roles_code_format check (code ~ '^[a-z][a-z0-9_]*$')
);
create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  created_at timestamptz not null default now(), created_by uuid references public.profiles(id) on delete set null,
  primary key (profile_id, role_id)
);
commit;
