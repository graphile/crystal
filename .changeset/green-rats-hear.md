---
"grafast": patch
---

Fix comparison typo in `connection()` that could, in an extremely contrived
situation[^1], cause otherwise identical connections to incorrectly deduplicate.

[^1]:
    Both connections would need to be set up identically, then just one of them
    would call `setLast()` at the end.
