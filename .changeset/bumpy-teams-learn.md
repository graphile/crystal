---
"postgraphile": minor
"@dataplan/pg": minor
---

Switch `PgSelectStep` and `PgUnionStep` from a subquery lateral join to a
**materialized** CTE lateral join. This appears to fix some bad planning
decisions that Postgres can make, e.g. where it might attempt a full table scan
hash join rather than a fast loop with efficient index lookups.
