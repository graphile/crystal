---
"graphile-utils": minor
"postgraphile": minor
---

`addPgTableCondition()` and `addPgTableOrderBy()` now support the match being
specified as a string: `my_schema.my_table` or
`"my.weird.schema"."my""weird""table"` saving you having to type out object
definitions (previously: `{schemaName:"my_schema",tableName:"my_table"}`)
