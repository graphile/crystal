---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
"pg-sql2": patch
---

Introduce `interface SQLable {[$$toSQL](): SQL}` to `pg-sql2` and use it to
simplify SQL fragments in various places.
