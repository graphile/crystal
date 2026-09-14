---
"@dataplan/pg": patch
---

`makeWithPgClientViaPgClientAlreadyInTransaction` is intended to be used in
tests for a PoolClient fresh from a `pg` connection pool, not in positions where
you've extracted the client from a `*WithPgClient(...)` step via the
`.rawClient` attribute. To help avoid users causing themselves deadlocks, we've
added a throw if you try to
`makeWithPgClientViaPgClientAlreadyInTransaction(nodePostgresPgClient.rawClient)`.
