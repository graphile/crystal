---
"graphile-build-pg": patch
"postgraphile": patch
---

Add `@isIndexed` smart tag so columns and foreign key constraints can be treated
as if they are indexed even if they aren't (for the purposes of the default
index behavior plugin)
