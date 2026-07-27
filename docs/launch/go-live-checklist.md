# Go-live gate

Current verdict: **NOT READY**. Repository preparation is complete, but production backend, authentication, domain and approvals are not.

## Blocking

- [ ] Confirmed Supabase project URL and publishable key.
- [ ] Explicit staging/production migration permission.
- [ ] Reviewed schema-gap migration for appointments/newsletter/public payload limits.
- [ ] Runtime RLS matrix passes with separate anonymous/non-admin/admin sessions.
- [ ] Production Admin Auth, allowlist and role authorization pass.
- [ ] Protected public submission endpoint, abuse controls and durable records pass.
- [ ] Exact production domain/canonical and GitHub Pages environment are configured.
- [ ] Legal/business/contact/catalogue content receives owner approval.

## Required before launch

- [ ] GitHub secrets/variables configured without exposing values.
- [ ] Production-like artifact and all routes tested on HTTPS.
- [ ] EN/AR/FR, RTL, mobile/desktop, 200% zoom and keyboard checks pass.
- [ ] Forms, CRM, Media Library and catalogue provider use production data safely.
- [ ] Database/storage backup and rollback owners confirmed.
- [ ] Canonical, sitemap, robots, structured data and Auth redirects agree with domain.
- [ ] PWA update/offline behavior verified from an existing and clean browser profile.
- [ ] User explicitly approves migrations, deployment, DNS and go-live.

## Optional after launch

- Search Console/Business Profile setup, analytics after consent review, clean localized/product URL generator, enhanced security-header proxy and field performance monitoring.

No `v1.0.0` tag is authorized until every blocking item passes on the real production environment.
