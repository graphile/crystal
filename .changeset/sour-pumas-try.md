---
"postgraphile": patch
"@dataplan/pg": patch
---

The `@dataplan/pg` adaptor type is now guessed from which adaptors you have
loaded into TypeScript (via path imports), so casting `@dataplan/pg`'s
`PgClient` to `NodePostgresPgClient` (to indicate you're using
`@dataplan/pg/adaptors/pg`) should no longer be necessary in most cases.
