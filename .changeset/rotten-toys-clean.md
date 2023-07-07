---
"graphile-build-pg": patch
"postgraphile": patch
---

Added `postgraphile/presets/relay` preset:

- Hides primary key columns from output schema, and includes `id: ID` instead
- Hides foreign key columns from output schema, expecting you to use the
  relation instead
- Hides columns that are part of the primary key from update/delete mutations
  (but still present for create if the column is writeable - it shouldn't be)
- Hides columns that are part of a foreign key from CRUD mutations/filters,
  instead exposes the `ID` for the remote side of the relation
- Does not allow ordering by individual primary key columns (though you can
  still order by `PRIMARY_KEY_ASC`/`DESC`)
- Does not allow ordering by individual foreign key columns
- Turns off the row fetchers that don't use the node `ID`
- Turns off the CRUD mutations that don't use the node `ID`
- Functions can now use `@arg0variant nodeId` to indicate the first argument
  (increase the `0` for other arguments) should accept a node `ID` (this
  currently only works where the argument type is a table type)
- Removes relations from mutation payloads, these should be traversed via the
  record instead (they're redundant)

Most of these changes are reversible, so for example if you really want to turn
back on `Query.userByUsername` you can do so by adding the `+connection`
behavior to the "unique username" constraint on the `users` table.
