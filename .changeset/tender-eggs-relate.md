---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

hasNextPage (via hasMore) now uses an access plan rather than a lambda plan.
