---
"grafast": minor
---

`coalesce` optimized to provide non-looping execute for small numbers of steps,
and now returns `constant(null)` when called with 0 steps.
