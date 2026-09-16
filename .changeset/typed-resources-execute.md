---
"@dataplan/pg": patch
---

`PgResource.execute()` now infers result type from underlying function signature. This has added two more generics to `PgResource` and `PgResourceOptions`, so you may need to update your code if you are explicitly stating these generics.
