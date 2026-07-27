begin;
create table public.brands (id uuid primary key default extensions.gen_random_uuid(), name text not null, slug text not null unique, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'));
create unique index brands_name_ci_key on public.brands (lower(name));
create table public.categories (id uuid primary key default extensions.gen_random_uuid(), name text not null, slug text not null unique, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'));
create unique index categories_name_ci_key on public.categories (lower(name));
create table public.products (
 id uuid primary key default extensions.gen_random_uuid(), legacy_id text, name text not null, slug text not null unique,
 brand_id uuid not null references public.brands(id) on delete restrict, category_id uuid not null references public.categories(id) on delete restrict,
 model text, sku text not null, calibre text, description text, price numeric(12,2), price_on_request boolean not null default false,
 status text not null default 'draft' check(status in ('draft','published','archived')), featured boolean not null default false,
 archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 created_by uuid references public.profiles(id) on delete set null, updated_by uuid references public.profiles(id) on delete set null,
 check (btrim(name) <> ''), check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
 check ((price_on_request and price is null) or (not price_on_request and price > 0)),
 check ((status='archived')=(archived_at is not null))
);
create unique index products_sku_ci_key on public.products(lower(sku));
create table public.product_specifications (id uuid primary key default extensions.gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, specification_key text not null check(btrim(specification_key)<>''), specification_value text not null check(btrim(specification_value)<>''), display_order integer not null default 0 check(display_order>=0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(product_id,specification_key));
create table public.product_status_history (id uuid primary key default extensions.gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, from_status text, to_status text not null check(to_status in ('draft','published','archived')), changed_by uuid references public.profiles(id) on delete set null, reason text, created_at timestamptz not null default now());
commit;
