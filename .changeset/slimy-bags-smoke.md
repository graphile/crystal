---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix issue whereby nodeId:insert/nodeId:update permissions were not rejected by
PgRBACPlugin when the underlying columns were not writable.
