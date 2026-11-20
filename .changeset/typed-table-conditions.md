---
"@dataplan/pg": patch
"graphile-utils": patch
"postgraphile": patch
---

When generated table resource types are available, `addPgTableCondition` infers
the table's attributes for `condition.where({ type: "attribute", ... })` in
`apply` callbacks. The same attributes are available inside `andPlan()`,
`orPlan()`, and `notPlan()`. An `existsPlan()` subquery can specify its own
attribute type.
