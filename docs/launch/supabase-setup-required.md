# Supabase setup required

The repository contains preparation code only. No Supabase project has been connected and no migration has been executed.

## Required user inputs

1. Confirmed production Supabase project URL.
2. Browser-safe Supabase publishable key.
3. Explicit approval to apply the reviewed migrations, preferably to staging first.
4. Confirmed admin email and choice of email/password or magic-link authentication.
5. Approved production origin(s) for Auth and Edge Function origin validation.
6. Decision on anti-spam/rate limiting and optional CAPTCHA after privacy review.

## Safe configuration approach

Deployment generates ignored `js/runtime-config.js` from `js/runtime-config.template.js`. Only project URL, publishable key, public site URL, environment label and admin allowlisted email may be emitted. Service-role keys, database passwords, JWT secrets and SMTP credentials remain platform secrets and never enter browser assets.

Local development without config is explicitly demo mode. A deployed production page without config enters configuration-error mode; it must not silently report successful production submissions.

## User actions before integration

- Create/identify staging and production projects.
- Review `docs/launch/supabase-migration-review.md` and resolve schema gaps.
- Back up any existing project before migrations.
- Apply migrations only after explicit approval.
- Deploy and configure the submission Edge Function.
- Create the first admin manually and grant a database-backed role.
- Execute the RLS matrix and record evidence.

Do not paste credentials into chat logs, commits, localStorage or public issue trackers.
