---
"postgraphile": patch
"@dataplan/pg": patch
---

Fix bug preventing using certain steps as input to `resource.find({...})` and
`resource.get({...})`.
