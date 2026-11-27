---
"graphile-build-pg": patch
"graphile-utils": patch
"postgraphile": patch
---

Fixes multipass discovery of enums referenced by `@foreignKey` so GraphQL fields
use the expected enum type. Related tables now expose their `@ref` fields when
the entire ref path stays within the exposed schemas.

Table-backed enum values now follow primary key order. Tables without a primary
key use the first unique constraint whose columns are all declared `NOT NULL`.
