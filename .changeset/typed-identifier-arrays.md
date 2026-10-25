---
"postgraphile": patch
"@dataplan/pg": patch
---

Batched queries pass identifiers as typed arrays, so Postgres estimates the
batch at its real size rather than at 100 rows.
