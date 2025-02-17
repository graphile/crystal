---
title: Database function restrictions
---

PostGraphile supports a wide range of PostgreSQL functions; however we do not
support:

- VARIADIC functions
- Overloaded functions (because it's not currently possible to expose them
  neatly over GraphQL)
- Functions that return `record` without any more type information (because we
  don't know what columns that `record` will contain, and thus cannot convert it
  to GraphQL)
  - To solve this, change `record` to be the name of a composite type that
    you've defined with `CREATE TYPE` (or similar)
