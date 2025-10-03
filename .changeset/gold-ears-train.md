---
"graphile-build-pg": patch
"postgraphile": patch
---

Softens the requirements for a column/relation to be treated as "indexed" to
reflect the optimizations in Postgres v18+. (This may result in more fields,
filters, orders and relations appearing in your PostGraphile schema - you can
use `@behavior -filterBy -orderBy` on columns and
`@behavior -select -list -connection -single -manyToMany` on foreign key
constraints to remove them again.)
