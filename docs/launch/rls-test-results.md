# RLS test matrix

Status: **NOT EXECUTED — credentials and migration permission missing**.

| Actor | Expected behavior | Runtime evidence |
|---|---|---|
| Anonymous | Read published products/media; cannot read drafts, inquiries, CRM or Admin; submit allowlisted fields only | Blocked |
| Authenticated non-admin | No Admin, CRM or Media management access | Blocked |
| Viewer | Read approved Admin datasets only | Blocked |
| Catalog manager | Approved catalogue writes, no CRM/media privilege escalation | Blocked |
| Media manager | Approved media operations, no CRM/catalog privilege escalation | Blocked |
| CRM manager | Inquiry/customer operations, notes private | Blocked |
| Super admin | Explicitly authorized operations with audit trail | Blocked |
| Service role | Edge Function/server only; never browser | Static scan passes; runtime blocked |

Policy names and SQL review are not accepted as proof. Tests must use separate real sessions and verify both allowed and denied operations after staging migrations.
