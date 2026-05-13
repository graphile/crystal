---
"@dataplan/pg": patch
---

Add new `PgCondition::ignoreUnlessAmended()` method to have PgCondition
modifiers only apply if additional conditions are added. Needed to fix a
regression in postgraphile-plugin-connection-filter
