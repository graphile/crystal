---
"grafast": patch
---

FieldArgs.apply can now accept a callback so each list entry can have its own
step (solves the OR vs AND issue in postgraphile-plugin-connection-filter).
