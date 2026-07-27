# Supabase migration review

Reviewed files: `001`–`009` plus `seed.sql`. They are ordered and have not been executed in this launch program.

## Existing coverage

- Extensions, profiles and role grants.
- Brands, categories, products, specifications and status history.
- Product/showroom media metadata and Storage buckets.
- Inquiries, customers, links, notes, tags and timeline.
- Collection settings, audit log and import jobs.
- RLS/storage policies, indexes, constraints and reference roles.

The migrations currently define 19 public tables, enable RLS on each and declare 34 policies. Public catalogue reads are limited to published/non-archived products. CRM/media/settings writes require database-backed roles. Service-role operations are documented as trusted-only.

## Gaps requiring a new reviewed migration before production

- No dedicated appointment/private-viewing fields/table for requested date, time range and category.
- Inquiry type constraint does not currently include `private_viewing` or `after_sales`.
- No newsletter subscription table/consent lifecycle.
- Anonymous direct INSERT is possible for inquiries; Edge Function-only grants/rate limiting should be chosen and tested.
- Field length limits and payload constraints need strengthening for all anonymous input.
- Admin allowlist/bootstrap and Auth method require an approved operational procedure.

Do not edit old applied migrations once a project exists. Resolve gaps in a new forward-only migration after staging review. Do not run `seed.sql` against production until its exact content is approved.

## Execution gate

Blocked: project URL, publishable key and migration permission were not supplied. Idempotency and policy behavior cannot be proven solely from SQL review. Apply to an empty staging project, capture CLI output without secrets, then run the RLS matrix before production.
