---
"@dataplan/pg": patch
---

Fix authorization check so it can call other steps (e.g. reading from
`context()`)
