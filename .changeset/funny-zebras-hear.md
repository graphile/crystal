---
"graphile-build-pg": patch
"postgraphile": patch
---

Plan computed column inputs (particularly Node IDs) in the root layer plan,
allowing for greater plan deduplication and more efficient SQL generation.
