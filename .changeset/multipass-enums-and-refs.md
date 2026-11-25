---
"graphile-build-pg": patch
"postgraphile": patch
---

Table-backed enum values now follow primary key order, or the first unique key
when there is no primary key.
