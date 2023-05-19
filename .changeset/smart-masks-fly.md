---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix naming conflict that occurs with `@enum` smart tag when not using
`@enumName`. New `enumTableEnum` inflector.
