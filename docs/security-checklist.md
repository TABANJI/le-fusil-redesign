# Production security checklist

SQL is only one control; every item must be evidenced before launch.

- **Authentication:** verified email; MFA mandatory for super-admin; finite session lifetime; tested reset; account disable/offboarding; no passwords outside Auth.
- **Authorization:** RLS enabled and role matrix tested as anon and every staff role; least privilege; quarterly role review; service-role key only in trusted runtime; role changes audited.
- **Database:** constraints and migration peer review; parameterized queries; daily backups; PITR if plan permits; restore drills; separate staging; no production data in development.
- **Storage:** MIME allow-list plus file-signature inspection; 15 MB product limit; sanitized UUID paths; malware/metadata review; private imports/exports; short signed-URL expiry; automatic cleanup.
- **Public inquiries:** server validation; rate limit; honeypot; Turnstile/CAPTCHA; generic response; consent version; spam monitoring; documented retention/deletion process.
- **Frontend:** strict CSP; context-aware escaping; no secrets/service key; dependency/SRI review where applicable; redact errors and source maps.
- **Operations:** audit monitoring; 12-month standard retention and approved longer security retention; incident runbook; key rotation; backup/restore test; admin offboarding; alerting and request IDs.

Never log passwords, access/refresh tokens, service keys, full inquiry bodies, full CRM exports or unneeded personal data. Hash IPs only with a rotated server-held secret and a documented purpose.
