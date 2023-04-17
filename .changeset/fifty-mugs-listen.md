---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

`PgConnectionArgFirstLastBeforeAfterPlugin` is now
`PgFirstLastBeforeAfterArgsPlugin` (because it applies to lists as well as
connections).
`PgInsertStep`/`pgInsert()`/`PgUpdateStep`/`pgUpdate()`/`PgDeleteStep`/`pgDelete()`
are now
`PgInsertSingleStep`/`pgInsertSingle()`/`PgUpdateSingleStep`/`pgUpdateSingle()`/`PgDeleteSingleStep`/`pgDeleteSingle()`
(to make space to add a future bulk API if we want to).
`config.schema.orderByNullsLast` is now `config.schema.pgOrderByNullsLast` for
consistency (V4 preset users are unaffected). Lots of field scopes in
`graphile-build-pg` have been updated to incorporate `field` into their names.
