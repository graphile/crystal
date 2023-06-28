---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

pgUnionAll uses a slightly more optimal SQL (where JSON isn't cast to `::text`
and then back to `::json`)
