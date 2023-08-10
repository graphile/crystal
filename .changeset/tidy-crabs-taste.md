---
"graphile-build-pg": patch
"@dataplan/pg": patch
"postgraphile": patch
---

`@dataplan/pg/adaptors/pg` now adds `rawClient` property which is the underlying
Postgres client for use with `pgTyped`, `zapatos`, and other libraries that can
use a raw postgres client. This is exposed via `NodePostgresPgClient` interface
which is a subtype of `PgClient`.
