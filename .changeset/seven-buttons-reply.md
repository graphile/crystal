---
"pg-sql2": patch
---

When the same `sql.value()` node is used in multiple places, it will now be
replaced with the same placeholder (`$1`, etc).
