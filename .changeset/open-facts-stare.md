---
"grafast": minor
---

Overhauls flag handling in grafast internals, fixing consistency and aligning
with expectations when combining `sideEffect()`, `trap()`, `inhibitOnNull()` and
related steps through implicit (rather than explicit) dependencies in a plan
resolver.
