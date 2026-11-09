---
"@dataplan/pg": patch
---

Fixes a bug where `pgSelect` and `pgUnionAll` used the GraphQL operation type
rather than step mode to determine behaviour.
