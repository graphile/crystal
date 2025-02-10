---
"grafast": patch
---

Fix bug in operation plan caching where planning errors will result in all
future usages of the same document resulting in the same error until server
restart.
