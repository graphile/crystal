---
layout: page
path: /postgraphile/function-restrictions/
title: Database Function Restrictions
---

PostGraphile supports a wide range of PostgreSQL functions; however we do not
support:

- VARIADIC functions
- overloaded functions (because it's not currently possible to expose them
  neatly over GraphQL)
- functions that return `record` without any more type information (because we
  don't know what columns that `record` will contain, and thus cannot convert it
  to GraphQL)
  - to solve this, change `record` to be the name of a composite type that
    you've defined with `CREATE TYPE` (or similar)

### Thanks

This page used to be a lot larger; until community contributor Matt Bretl
swooped in and lifted almost all the restrictions &mdash; thanks Matt!
