---
"postgraphile": minor
"@dataplan/pg": minor
---

`PgUpdateSingleStep` no longer throws an error if you don't provide any values to
update; instead it simply exits having changed no rows.
