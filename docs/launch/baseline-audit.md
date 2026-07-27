# LE FUSIL launch baseline audit

Snapshot date: 2026-07-27  
Baseline commit: `c242b3b`  
Local safety tag: `launch-audit-c242b3b`

## Current architecture

LE FUSIL is a framework-free static HTML/CSS/JavaScript site hosted conceptually on GitHub Pages. Fourteen HTML routes share client-rendered header/footer components, URL-driven EN/AR/FR localization, a static catalogue in `data/products.js`, browser-local demo administration/CRM/media tools, and a service worker/PWA shell. Public product routes use `product.html?slug=<slug>`.

The repository contains 17 CSS files, 31 JavaScript files, seven translation bundles, static product/showroom media, 10 SQL files (nine ordered migrations plus seed), and an existing data-provider abstraction. Current canonical deployment references target `https://tabanji.github.io/le-fusil-redesign/`.

## Routes

- Public: `/`, `shop.html`, `product.html?slug=…`, `contact.html`, `appointment.html`, `about.html`.
- Legal/service: `privacy.html`, `terms.html`, `cookies.html`, `legal-notice.html`, `responsible-use.html`.
- Utility: `404.html`, `offline.html`.
- Administration: `admin.html` (currently demo/local-storage based and not production-authenticated).

There is no separate shortlist page; shortlist state is integrated into Collection/Product UI.

## Current features

- Luxury Homepage, Collection, Product, Showroom and Private Viewing experiences.
- Static catalogue, filters, search, sorting, shortlist, galleries and lightbox.
- EN/AR/FR locale switching with RTL support.
- Cookie consent, PWA manifest/service worker, SEO metadata and structured data.
- Demo Admin, CRM and Media Library.
- Contact/private-viewing records stored locally for demonstration.

## Deployment and backend status

- Hosting target: GitHub Pages project URL; no production workflow is present at baseline.
- Production domain: not supplied.
- Supabase: schema/provider blueprint exists, but no runtime client or verified project connection exists.
- Migrations: present locally; not executed against a real project in this program.
- Admin authentication: demo-only; unsuitable for unrestricted production exposure.
- Public submissions: local demo storage; no durable protected backend.
- Domain, HTTPS custom-domain state, Search Console and analytics: unconfigured/unverified.

## Known demo-only components

- Admin login and authorization.
- Product/Media/CRM persistence.
- Contact and appointment submission.
- Media replacement/upload preview.
- Analytics abstraction is disabled.

## Configuration placeholders

- Legal business name and registration data.
- Public phone, email, WhatsApp, confirmed hours and social URLs.
- Production domain/public site URL.
- Supabase project URL and publishable key.
- Admin allowlisted email.
- Optional analytics and Search Console identifiers.

The real showroom address is configured as Yara Center, Jdeideh Boulevard, Jdeideh, Mount Lebanon, Lebanon. No coordinates are configured.

## Production blockers

### Blocking

1. No confirmed Supabase project credentials or migration authorization.
2. No production-safe Admin authentication/RLS runtime verification.
3. Public forms have no durable protected submission endpoint.
4. No exact production domain or DNS/provider details.
5. Legal/business content and public contact details remain owner-unapproved/incomplete.

### Required before launch

- Execute and test migrations/RLS on the confirmed project.
- Configure an admin account/allowlist through a secure manual flow.
- Configure deployment secrets and validate a production-like build.
- Approve canonical domain, legal copy, catalogue content and retention policy.
- Verify HTTPS, forms, Admin, sitemap, robots, structured data and PWA on the real URL.

### Optional after launch

- Analytics after consent/privacy review.
- Search Console and Google Business Profile setup.
- Clean generated product URLs and fully static localized route generation.

## Required user credentials and approvals

- Supabase project URL and publishable key.
- Explicit permission to run reviewed migrations.
- Confirmed admin email and chosen authentication method.
- Exact domain, preferred apex/www canonical and registrar/DNS provider access.
- GitHub Pages/repository environment access.
- Search Console and DNS verification access.
- Approved phone/email/hours only if they should be public.
- Legal and product-content approval.

No secrets, migration execution, deployment, DNS modification, Search Console submission, release tag or push is authorized by this audit.
