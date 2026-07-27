# LE FUSIL backend architecture

## Scope and boundaries

This package is a migration blueprint, not a live integration. The static website and demo admin remain on their existing JavaScript/localStorage paths. No Supabase SDK, project URL, credential, network call, order, payment, cart, checkout, shipping, or online purchasing flow is introduced.

## Target architecture

- **Browser:** anonymous catalog reads and inquiry submission through a future data provider. Only the anon key may be present.
- **Supabase Auth:** staff identities. `profiles.id` references `auth.users.id`; passwords remain exclusively in Auth.
- **Postgres:** catalog, media metadata, inquiries, CRM, settings, imports and audit. RLS is the authorization boundary.
- **Storage:** `product-media` for approved assets; private `admin-imports` and `admin-exports` with short-lived signed URLs.
- **Trusted server/Edge Functions:** role grants, first-admin bootstrap, validated bulk import, customer merge, media processing, anti-spam inquiry endpoint, audit retention, signed export generation and other service-role operations.

## Roles

`viewer` reads administrative data. `catalog_manager` maintains brands, categories, products and specifications. `media_manager` maintains media records/objects. `crm_manager` manages inquiries and CRM. `super_admin` manages profiles, roles, settings and imports. Roles are additive and checked through non-recursive `SECURITY DEFINER` helpers with an empty `search_path`.

## Storage and images

Store bucket plus path, never a public URL as the source of truth. Proposed paths are `products/{product-id}/original/{uuid}.jpg` and `products/{product-id}/derived/{width}/{uuid}.webp` for 640, 960, 1280 and 1600 widths. Option A uses Supabase Image Transformation at delivery time. Option B validates the original and generates derivatives in a trusted upload workflow. Option B gives predictable formats/costs; Option A reduces pipeline complexity. No processing is implemented here.

## API rules

Providers return normalized contracts from `data-contracts.js`. Money is a decimal string at the boundary and `numeric(12,2)` in Postgres. Dates are ISO 8601 UTC. Public inquiry submission returns only `{ reference, status }`, never the stored record. Pagination is one-based and filters/sorts are allow-listed.

## Deletion and retention

Product children use cascade only where their meaning cannot survive the parent (`specifications`, images, status history). Brand/category deletion is restricted. Inquiries linked to customers are restricted and retained. CRM notes use soft deletion. Normal audit retention is 12 months; security events may be retained longer under an approved policy. Audit deletion is a scheduled/super-admin trusted operation, never a browser operation.

## Known limitations

SQL has not been applied to a live Supabase instance. Storage signature inspection, transformations, CAPTCHA/rate limiting, Auth hooks, email delivery, backups/PITR, observability and Edge Functions remain implementation work. RLS and migrations reduce risk but do not by themselves guarantee production security.
