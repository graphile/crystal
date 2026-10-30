---
"postgraphile": minor
"@dataplan/pg": minor
---

`pgResource.get(...)` now allows steps representing null/undefined in each
field - requiring the steps be non-null does not guarantee the result will exist
so it just adds burden for plan writers without benefit.
