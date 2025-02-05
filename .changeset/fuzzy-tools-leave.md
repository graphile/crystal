---
"grafast": patch
---

Fix bug where streamed and non-streamed steps could be deduplicated; and use a
cloned subplan for pageInfo calculations.
