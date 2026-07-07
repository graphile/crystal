---
"graphile-build-pg": patch
"postgraphile": patch
---

Add `pgResource.extensions.isView`, `.isMaterializedView`, `.isForeignTable` so
plugins can determine which resources came from views/materialized views/foreign
tables.
