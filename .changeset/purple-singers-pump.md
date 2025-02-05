---
"grafast": patch
---

Fix bug where `deduplicate()` lifecycle method wasn't called on some steps (e.g.
those with side effects, or those streamed). Instead, the method is still called
now but it is passed an empty array.
