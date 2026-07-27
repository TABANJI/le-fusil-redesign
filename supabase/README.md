# Supabase architecture package

This directory is not connected to a Supabase project. Migrations are ordered and should first be applied to a disposable/staging project after review. `seed.sql` is idempotent reference data only.

The migrations create extensions, staff roles, catalog, media, inquiries/CRM, settings/audit/imports, RLS/storage policies, indexes/triggers and safe role seeds. Product data is intentionally excluded and must enter through the validated JSON process in `docs/migration-plan.md`.

Operations requiring trusted server or Edge Functions include service-role use, first-admin/role grants, bulk import rollback, customer manual merge, media signature validation/derivatives, anti-spam submission, signed CRM exports and audit retention. Do not expose private bucket URLs or the service-role key to browser code.
