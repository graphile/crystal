---
"postgraphile": patch
"@dataplan/pg": patch
---

SQL is now generated in a slightly different way, helping PostgreSQL to optimize
queries that have a batch size of 1.
