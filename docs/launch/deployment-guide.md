# Production deployment guide

The prepared GitHub Pages workflow is QA-gated and does not run from this local task. Configure the `production` environment before enabling it.

Required encrypted secrets: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`. Required environment variables: `PUBLIC_SITE_URL`, `ADMIN_ALLOWED_EMAIL`. Only browser-safe values are written to generated `js/runtime-config.js`; server secrets belong in Supabase Edge Function secrets.

Run staging migrations and RLS tests first. Then execute the workflow manually, inspect the artifact, verify all public routes/forms/auth on the Pages URL, and only then allow main-branch automatic deployments. Failed audit/config validation stops artifact upload.

Current workflow uses official GitHub Pages actions. Recheck action majors and pin to reviewed commit SHAs before a high-assurance launch.
