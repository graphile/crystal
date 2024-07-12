---
"grafast": patch
---

Fix bug where resolvers would incorrectly deduplicate (cannot deduplicate
because ResolveInfo may or may not be used, and that is different for every
field).
