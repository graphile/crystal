---
"graphile-build-pg": patch
"postgraphile": patch
---

Add `pgResource.extensions.isView` and `.isMaterializedView` so we can determine
which resources came from views/materialized views.
