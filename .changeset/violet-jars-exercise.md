---
"graphile-build": patch
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Start migrating away from `applyPlan`/`inputPlan`. ~~When adding an argument to
a field you can now augment the field's plan resolver via
`context.addToPlanResolver` hook~~ (this was later replaced with new
`inputApply()` step, and arguments still keep `applyPlan` though input object
fields lose it). Use this and other changes to move handling of orderBy to
runtime from plantime.

Introduces runtime query builder for `PgSelectStep` and `PgUnionAllStep`, and
`PgSelectStep.apply()`/`PgUnionAllStep.apply()` so that you can register
callbacks that will augment the query builder at runtime.
