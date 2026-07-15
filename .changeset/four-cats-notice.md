---
"graphile-utils": patch
"postgraphile": patch
---

Fix bug in `addPgTableOrderBy` that meant that an override for the `nullable`
parameter would be ignored.
