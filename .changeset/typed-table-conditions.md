---
"@dataplan/pg": patch
"graphile-utils": patch
"postgraphile": patch
---

When using `@graphile-pro/postgraphile` v0.4.0+ for type generation,
`addPgTableCondition` now infers the table's attributes for
`condition.where({ type: "attribute", ... })` in `apply` callbacks.
