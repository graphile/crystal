---
"@dataplan/pg": minor
---

Move PostgreSQL caching from PgExecutor to Grafast caching mechanisms.
`PgExecutor.executeWithCache` is now deprecated and forwards to
`executeWithoutCache` with a logged warning.
