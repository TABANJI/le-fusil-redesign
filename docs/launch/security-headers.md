# Recommended production security headers

GitHub Pages does not provide repository-controlled arbitrary response headers. Use a reviewed edge proxy only if these headers are required; do not change hosting solely for cosmetic scores.

Recommended baseline after testing: `Content-Security-Policy` with `default-src 'self'`, explicit Supabase connect/image origins, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and `frame-ancestors 'none'`; `Referrer-Policy: strict-origin-when-cross-origin`; `X-Content-Type-Options: nosniff`; a minimal `Permissions-Policy`; and HSTS only after the final domain is stable on HTTPS.

CSP must first run in report-only mode because current inline structured data/styles and generated runtime config need review. Never weaken CSP with broad wildcards or expose violation reports containing PII.
