---
"graphile-build-pg": patch
"graphile-build": patch
"@dataplan/pg": patch
"grafast": patch
---

Move postgresql argument logic to runtime (from plantime) to avoid plantime eval
of input values.
