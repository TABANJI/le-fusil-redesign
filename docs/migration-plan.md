# Migration plan

Every phase is independently gated; do not advance on failed verification.

| Phase | Prerequisites and work | Verification | Rollback / risks |
|---|---|---|---|
| 0 — baseline | Back up Git; export demo localStorage; freeze schema/contract versions; inventory 34 products, 89 JPG originals and current WebP files | hashes, counts, unique IDs/slugs/SKUs, restorable exports | restore Git/export; risk: incomplete browser-local data |
| 1 — foundation | Create separate Supabase environments; apply migrations 001–009; seed roles; securely bootstrap first super-admin | migration log, RLS matrix, Auth/MFA smoke tests | discard empty project or restore pre-migration DB; risk: policy lockout |
| 2 — catalog/media | Transform validated product JSON; map legacy IDs; import 34 products/specifications; upload 89 originals; choose derivative strategy | 33 numeric and 1 request price; file hashes; URL/alt/gallery checks | delete migration batch via trusted job and restore storage manifest; risk: bad mapping or metadata |
| 3 — inquiries/CRM | Import inquiries; normalize email; create customers; link without deleting inquiry history | source/target counts, collision report, manual-review queue | restore DB snapshot; risk: false identity merge—never merge by phone alone |
| 4 — providers | Implement Supabase provider; retain local provider; add environment feature flag defaulting to local | contract tests and side-by-side response comparison | disable flag; risk: contract drift |
| 5 — admin | Enable Auth, role navigation and trusted media workflow | each-role permission tests, MFA, upload validation | revert flag/admin deployment; preserve local emergency export |
| 6 — public | Switch published reads and inquiry submission; add server validation, rate limit and Turnstile/CAPTCHA | anonymous SELECT/INSERT tests and proof anonymous cannot read inquiries | switch reads/submissions back; risk: spam or availability outage |
| 7 — cutover | Remove demo credentials and localStorage source-of-truth; retain read-only emergency export | production smoke test, audit/backup/restore drill | deploy prior release and restore snapshot; risk: irreversible local-only edits |

Imports are validate-then-transaction: record `import_jobs`, store the large payload privately, validate schema/references, create a backup reference, apply atomically, record safe counts, and expire payloads. Never hardcode the 34 products into schema migrations.
