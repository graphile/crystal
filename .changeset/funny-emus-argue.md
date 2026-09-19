---
"postgraphile": minor
"@dataplan/pg": minor
---

`PgInsertStep`, `PgUpdateStep` and `PgSelectStep` gain new experimental "wrap"
functionality allowing you to wrap a CRUD mutation with logic before and after
whilst retaining access to the database transaction (e.g. to allow
abort/rollback). Useful for data validation, coercion, result validation, and
auditing.
