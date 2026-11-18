---
"grafast": minor
"@dataplan/pg": minor
---

Add (experimentally) cross-step batch requests as a core feature. Previously
this was left for user-space to solve, `loadOne`/`loadMany` had their own
solution and `pgSelect`/`pgUnionAll` used their own solution... Now we've
standardized a common interface for all of them to use in the form of the
`ExecutionDetails.batch` function passed to Step execute methods.

We then rewrote the aforementioned steps to use this new batching. Amongst other
improvements, this managed to reduce the number of SQL queries that our test
suite run, so hopefully it will have a positive impact on your apps too!

Batching works via an executor - your callback function - and compatible calls
from steps that become ready in the same tick get batched. Executors accept both
a list of keysets and optionally some options. The options objects are
deduplicated (otherwise you wouldn't get shared batching!) but you control how
via an `optionsMatch` spec. Similarly, each keyset in the keysets list can be
deduplicated via strict, tuple, or object equality checks. Results are designed
to be returned from the `execute` method: they remain in the caller's original
key order, including duplicates. Compatible calls share in-flight work and
cached results for the lifetime of the execution scope. Mutation fields and
subscription events each have their own scope.

(We also added the `defineBatchExecutor` TypeScript Identity Function to help
you define batch executors with strong types in your own code.)

Move PostgreSQL read caching into the shared batching scope. Successful
mutations invalidate that scope. `PgExecutor.executeWithCache` now forwards to
`executeWithoutCache` and logs a deprecation warning once.
