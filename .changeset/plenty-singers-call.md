---
"grafast": patch
---

Moved calculation of `@stream` parameters to runtime, which has meant that
stream info is no longer passed at planning time - instead execute() can
evaluate if it is being streamed or not and make decisions based on that.
