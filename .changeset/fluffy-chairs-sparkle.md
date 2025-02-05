---
"@dataplan/pg": patch
---

Move more logic to runtime, clean up plan diagrams, change how cursors work, fix
pagination cursor signature in pgUnionAll, generally lay groundwork for runtime
(rather than plantime) evaluation of custom ordering, conditions, etc.
