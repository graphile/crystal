---
"grafast": minor
"@dataplan/pg": patch
---

Add `ExecutionDetails.batch` for combining equivalent work from steps that
become ready in the same tick, and use it for `loadOne`, `loadMany`, `pgSelect`,
and `pgUnionAll`. Use it in your own step classes too!
