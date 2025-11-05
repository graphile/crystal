---
"grafast": patch
---

Fixes the performance of the recursive algorithm used to determine if one step
depends on another (performance regression introduced in RC.1). Thanks to @purge
for reporting and providing a reproduction.
