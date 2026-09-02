---
"grafast": patch
---

Fix bug in `inhibitOnNull()` where errors would also be captured and consumed.
Also optimizes layer plans: nullableBoundary now prevents further propagation of
side effects.
