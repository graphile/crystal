---
"graphile-build-pg": patch
"postgraphile": patch
---

Fixes a bug where smart tags such as `@sortable` and `@filterable` would have a
function appear in the schema (e.g. as order/filter options) even though
invoking the function would always result in a permissions error. If you're
using PgRBACPlugin (enabled by default in Amber preset, disabled by V4 preset
unless `ignoreRBAC: false` is specified) then this might result in some
inaccessible fields being removed from your GraphQL schema.
