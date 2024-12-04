---
"graphile-build-pg": patch
"postgraphile": patch
---

Hotfix to inflection changes in beta.34 - fixes behavior of
`orderByAttributeEnum` and removes V4 override of `_joinAttributeNames` which
shouldn't be necessary (and seems to do more harm than good).
