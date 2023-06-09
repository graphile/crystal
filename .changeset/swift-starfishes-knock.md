---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug causing `@foreignKey` relation to not show up under rare circumstances
(by updating PgRelationsPlugin to use codec, not resource, as the primary
entity).
