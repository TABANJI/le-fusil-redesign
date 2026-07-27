# Rollback guide

1. Identify the last verified Git commit and Pages deployment; do not rewrite history.
2. Redeploy the prior artifact or create a forward revert commit.
3. If data changed, pause writers, take a backup and use a reviewed forward corrective migration. Never improvise destructive `DROP` statements.
4. Roll back Edge Functions to the last verified bundle and verify environment secrets without printing values.
5. Bump the service-worker cache version when stale assets caused the incident; test a clean and an existing client.
6. Verify Homepage, Collection, Product, forms, Admin auth, RLS, sitemap and robots before reopening writes.

Database backups, storage inventories and migration output must exclude PII from the repository.
