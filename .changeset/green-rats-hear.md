---
"grafast": patch
---

Fix comparison typo in `connection()` that could, in an extremely contrived
situation, cause otherwise identical connections to incorrectly deduplicate.
