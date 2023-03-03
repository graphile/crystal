---
"graphile-build-pg": patch
"postgraphile": patch
---

Option for `@foreignKey` smart tag to have unique auto-created for it to ease
transition from V4:
`{ gather: { pgFakeConstraintsAutofixForeignKeyUniqueness: true } }`
