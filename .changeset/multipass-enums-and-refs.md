---
"graphile-build-pg": patch
"graphile-utils": patch
"postgraphile": patch
---

Fixes multipass discovery of enums referenced by `@foreignKey` so GraphQL fields
use the expected enum type.

Table-backed enum values now follow primary key order, or the first unique key
when there is no primary key.
