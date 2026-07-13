---
"graphile-build-pg": minor
"postgraphile": minor
---

Fix: index behaviors plugin updated so that only attributes (columns) on tables,
materialized views and foreign tables are scanned for indexes; all other types
(including composite types, views, ...) are given the benefit of the doubt.

This might result in more fields showing up in your schema.
