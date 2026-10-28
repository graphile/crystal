---
"postgraphile": patch
"@dataplan/pg": patch
---

Batched queries pass each identifier column as a `text[]` and `unnest` it, so
Postgres estimates the batch at its real size rather than at 100 rows.
