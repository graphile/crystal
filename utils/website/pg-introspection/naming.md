---
sidebar_position: 3
---

# Naming

Using the PostgreSQL column names is _by design_, even though some are hard to
read if you're not familiar with the system catalog.

We use `_id` rather than `oid` because older versions of PostgreSQL did not
explicitly list the `oid` columns when you `select * from` so we explicitly list
them among the selection set.
