---
"graphile-build-pg": patch
"@graphile/simplify-inflection": patch
"postgraphile": patch
---

`@foreignFieldName` smart tag is now fed into the
`inflection.connectionField(...)` or `inflection.listField(...)` inflector as
appropriate. If you are using `@foreignSimpleFieldName` you may be able to
delete that now; alternatively you should consider renaming `@foreignFieldName`
to `@foreignConnectionFieldName` for consistency.
