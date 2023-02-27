---
"@dataplan/pg": patch
"graphile-build-pg": patch
"postgraphile": patch
---

Add `extensions.pg = { databaseName, schemaName, name }` to various DB-derived
resources (codecs, sources, etc).
