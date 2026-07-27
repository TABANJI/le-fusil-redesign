begin;
insert into public.roles(code,name,description) values ('super_admin','Super Admin','Full administrative access.'),('catalog_manager','Catalog Manager','Catalog and publication management.'),('media_manager','Media Manager','Product and showroom media management.'),('crm_manager','CRM Manager','Inquiry and customer relationship management.'),('viewer','Viewer','Read-only administrative access.') on conflict(code) do update set name=excluded.name,description=excluded.description;
commit;
