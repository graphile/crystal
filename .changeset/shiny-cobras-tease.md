---
"graphile-build-pg": patch
"postgraphile": patch
---

`*FieldName` smart tags are now used verbatim rather than being piped through
`inflection.camelCase(...)` - you've explicitly stated a 'field name' so we
should use that. This may be a breaking change for you if your field names are
currently different before/after they are camelCase'd.
