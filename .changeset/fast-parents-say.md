---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
"pgl": patch
---

Fix a bug with mutations where the results of computed columns were calculated
using the snapshot from before the mutation (due to the way Postgres works).
Solved by breaking the post-mutation function calls out into a separate
post-mutation statement.
