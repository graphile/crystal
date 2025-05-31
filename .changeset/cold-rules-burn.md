---
"@dataplan/pg": patch
---

Avoid unnecessary self-joins when inlining a `pgSelectFromRecord` step into a
parent PgSelectStep.
