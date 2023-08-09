---
"postgraphile": patch
"graphile-build-pg": patch
---

Disable mutations for `@interface mode:relational` tables. (They shouldn't have
been enabled, and they don't work yet.)
