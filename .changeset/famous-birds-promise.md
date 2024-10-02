---
"@dataplan/pg": patch
"grafast": patch
---

Add support for stable deduplication of object/list arguments to
loadOne/loadMany, reducing redundant fetches.
