---
"graphile-build": patch
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Start migrating away from `applyPlan`/`inputPlan`, when adding an argument to a
field you can now augment the field's plan resolver via
`context.addToPlanResolver` hook. Use this and other changes to move handling of
orderBy to runtime from plantime.
