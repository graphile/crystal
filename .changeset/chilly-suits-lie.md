---
"grafast": patch
"graphile-build-pg": patch
"postgraphile": patch
---

PgClassSinglePlan is now enforced, users will be informed if plans return a step
incompatible with the given GraphQL object type.
