---
"graphile-build-pg": minor
---

improve smart tags for polymorphic types

- fix @returnType for functions returning setof (for lists and connections)
- support @returnType for foreign key constraints
- add @foreignReturnType for the backward relation of a foreign key constraint
- add @applyToType for computed columns, so a computed column defined on a
  polymorphic PostgreSQL table can be exposed only on a specific concrete
  GraphQL type.
