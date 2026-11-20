---
"grafast": patch
"@dataplan/pg": patch
---

Grafast now works out which steps may stream after planning and deduplication,
from the lists that consume them, rather than steps guessing during planning.
Steps that can stream receive `addStreamDetails()` once per consuming list after
planning (`null` still wins); steps that yield another step's list as their own
declare `streamSourceDepIndex()`, and `$step.mayStream()` reports the result.
`willNotStream()` is gone, and steps no longer need
`currentFieldStreamDetails()`.
