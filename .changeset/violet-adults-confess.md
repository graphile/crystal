---
"graphile-build-pg": patch
"postgraphile": patch
---

Add `preset.gather.pgIdentifiers` setting (values: 'qualified' or
'unqualified'); if set to 'unqualified' then we will not add the schema name to
table or function identifiers - it's up to you to ensure they're present in the
`search_path` (which you can set via `pgSettings` on a per-request basis).
