# Post-launch monitoring

## First 24 hours

- Verify uptime, canonical HTTPS and redirect behavior.
- Submit test contact/private-viewing requests without real customer PII and confirm inserts/Admin visibility.
- Review Edge Function safe diagnostics, denied RLS actions, 404/broken assets and service-worker updates.
- Confirm Admin logout/session expiry and no cached sensitive UI.
- Verify sitemap availability and Search Console property state.

## First 7 days

- Review indexing/sitemap/canonical reports and available Core Web Vitals field data.
- Review form spam, rate limits, RLS/Auth logs, storage/database growth and backup success.
- Check external links and catalogue accuracy/availability workflow.

## First 30 days

- Review search impressions, indexed pages, top non-PII queries and approved conversion events.
- Assess enquiry quality, content gaps, stale products, retention/deletion operations and dependency/security advisories.
- Test restore procedure and review least-privilege access.

Monitoring exports must not place PII, credentials or raw production database dumps in the repository.
