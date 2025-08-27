---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug in PgIndexBehaviorsPlugin that would treat all view attributes as
unindexed. Views can't have indexes, so we must give them the benefit of the
doubt.
