# Deployment runbook

Commands below are examples; the Supabase CLI is not assumed installed and none are executed by this package.

1. Approve schema, RLS matrix, data-processing purpose and retention. Create separate staging/production projects and record project references in the secret manager.
2. Configure browser `SUPABASE_URL`/`SUPABASE_ANON_KEY`; configure `SUPABASE_SERVICE_ROLE_KEY` only in trusted server/Edge Function secrets.
3. Apply migrations in numeric order using Dashboard SQL editor or an approved CLI workflow such as `supabase db push`. Capture output and database backup reference.
4. Run `supabase/seed.sql`. Create the first Auth user through a secure operator flow, insert its profile, grant `super_admin` in a reviewed server-side transaction, enable MFA, then test a second recovery admin.
5. Confirm three buckets and limits. Keep imports/exports private. Test signed URL expiry and product asset authorization.
6. Execute RLS tests: anonymous published reads and inquiry insert; denial of inquiry read/update/delete; each staff role’s allowed and denied operations.
7. Run catalog/CRM dry-run import in staging, reconcile counts/hashes/collisions, then repeat in production under an import job and transaction.
8. Deploy provider behind a disabled feature flag; smoke-test Homepage, Shop, Product, Contact, Admin, Products, Inquiries, CRM and Media Library in staging. Enable progressively in production.
9. Monitor errors, auth, rate limits, audit events and storage. Rotate exposed credentials immediately; anon keys are identifiers, service-role keys are secrets.

## Rollback

Disable the provider flag first. Stop import/upload workers. Restore the pre-deployment database backup and storage manifest if writes occurred; deploy the prior frontend; validate counts and RLS. Do not reverse migrations with ad-hoc destructive `DROP`; prepare and review a forward corrective migration. Record the incident and rotate secrets when exposure is possible.
