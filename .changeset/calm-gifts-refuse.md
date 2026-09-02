---
"grafast": minor
---

Overhauls flag handling in grafast internals, fixing consistency and aligning
with expectations when combining `sideEffect()`, `trap()`, `inhibitOnNull()` and
related steps through implicit (rather than explicit) dependencies in a plan
resolver. Fixes bug in `inhibitOnNull()` where errors from an implicit side
effect would be captured and consumed. Optimizes layer plans: nullableBoundary
now prevents further propagation of side effects.
