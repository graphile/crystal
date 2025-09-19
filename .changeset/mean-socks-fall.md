---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
"pgl": patch
---

`@dataplan/pg` now exports `sql` from `pg-sql2` and also adds forwards to the
whole module (`import ... from '@dataplan/pg/pg-sql2'`)
