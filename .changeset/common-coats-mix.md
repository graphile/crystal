---
"@dataplan/json": patch
"@dataplan/pg": patch
"grafast": patch
---

Make `get($step, attr)` more type-safe when the underlying steps implement the
new `__inferGet` pattern.
