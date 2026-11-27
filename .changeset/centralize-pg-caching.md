---
"@dataplan/pg": minor
---

Move PostgreSQL caching from `PgExecutor` to Gra*fast* batching.
`PgExecutor.executeWithCache` now logs a deprecation warning and forwards
uncached reads to `executeShared`. Compatible reads can share a PostgreSQL
client. Use `ExecutionDetails.batch` to cache results.
