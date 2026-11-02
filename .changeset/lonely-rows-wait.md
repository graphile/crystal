---
"@dataplan/pg": patch
"postgraphile": patch
---

Fix `Cannot read properties of undefined (reading '0')` when a step is inlined
via subquery into a parent `.single()` that found no row.
