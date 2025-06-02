---
"grafast": patch
---

Batches calls to plan resolvers to ensure we're not calling them more often than
needed (reducing dependence on deduplicate to clean up our steps - especially
during polymorphism)
