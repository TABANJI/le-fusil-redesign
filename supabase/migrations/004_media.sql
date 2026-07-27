begin;
create table public.product_images (
 id uuid primary key default extensions.gen_random_uuid(), product_id uuid references public.products(id) on delete cascade,
 storage_bucket text not null default 'product-media', storage_path text not null, original_filename text not null,
 mime_type text not null check(mime_type in ('image/jpeg','image/png','image/webp','image/avif')), width integer check(width>0), height integer check(height>0), file_size bigint check(file_size>0),
 alt_text text not null default '', image_role text not null check(image_role in ('cover','gallery','showroom')), display_order integer not null default 0 check(display_order>=0),
 is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by uuid references public.profiles(id) on delete set null,
 unique(storage_bucket,storage_path), check((image_role='showroom' and product_id is null) or (image_role<>'showroom' and product_id is not null))
);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('product-media','product-media',false,15728640,array['image/jpeg','image/png','image/webp','image/avif']),
 ('admin-imports','admin-imports',false,52428800,array['application/json','text/csv']),
 ('admin-exports','admin-exports',false,52428800,array['application/json','text/csv'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
commit;
