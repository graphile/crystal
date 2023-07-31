---
"graphile-build-pg": patch
"postgraphile": patch
---

When using `@interface mode:relational`, don't add pointless relationships from
concrete type back to abstract or from abstract to related concrete types.
