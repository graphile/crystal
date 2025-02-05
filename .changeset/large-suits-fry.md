---
"@dataplan/pg": patch
---

Remove `$input.eval*()` usage from pgSelect; instead construct related
SQL/values at runtime.
