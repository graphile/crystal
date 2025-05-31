---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug with `@ref ... plural` smart tag where multiple `@refVia` are present
but the target type is not abstract.
