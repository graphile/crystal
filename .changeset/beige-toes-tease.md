---
"@dataplan/pg": patch
---

Add new `RECORD_EXPRESSION` mode to PgCondition so
postgraphile-plugin-connection-filter doesn't need to rely on a hack to enable
filtering on composite columns. Also changes `PgCondition` signature to accept a
configuration object.
