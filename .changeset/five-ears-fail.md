---
"@dataplan/pg": patch
"graphile-build-pg": patch
---

pgConfig.listen is no more; it was redundant versus PgSubscriber. Have migrated
PgIntrospectionPlugin to use PgSubscriber instead.
