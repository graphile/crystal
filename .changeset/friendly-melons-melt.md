---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
---

`@interface mode=single/relational` now get `Node` interface if the table has a
PK.

🚨 `@interface mode=union` no longer gets `Node` interface unless you also add
`@behavior node`.
