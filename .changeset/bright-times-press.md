---
"graphile-build-pg": patch
"postgraphile": patch
---

Fixes a bug in relational polymorphism where PostgreSQL functions returning
polymorphic records were causing planning errors.
