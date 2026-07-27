-- Safe, idempotent reference seed. It contains no products, people, credentials or inquiries.
insert into public.roles(code,name,description) values
('super_admin','Super Admin','Full administrative access.'),('catalog_manager','Catalog Manager','Catalog and publication management.'),('media_manager','Media Manager','Media metadata and storage workflows.'),('crm_manager','CRM Manager','Inquiry and customer management.'),('viewer','Viewer','Read-only administrative access.')
on conflict(code) do update set name=excluded.name,description=excluded.description;
insert into public.collection_settings(key) values('default') on conflict(key) do nothing;
