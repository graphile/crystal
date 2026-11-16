---
"grafast": patch
---

`trap()` with `TRAP_ERROR` now traps the error of a step whose whole execution
rejected (for example a failed write); previously the trapped step was inhibited
and resolved to `null` with no error.
