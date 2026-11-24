---
"@dataplan/pg": minor
---

Move PostgreSQL caching from `PgExecutor` to Gra*fast* batching.
`PgExecutor.executeWithCache` is now deprecated and forwards to
`executeWithQueue` with a logged warning. `executeWithQueue` shares client
leases for compatible reads. Use `ExecutionDetails.batch` to cache results.
