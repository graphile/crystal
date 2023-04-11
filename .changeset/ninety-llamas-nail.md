---
"postgraphile": patch
"@dataplan/pg": patch
---

`EXPLAIN ANALYZE` (for `SELECT`) and `EXPLAIN` (for other operations) support
added. Currently requires `DEBUG="datasource:pg:PgExecutor:explain"` to be set.
Publish this through all the way to Ruru.
