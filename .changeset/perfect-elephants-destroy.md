---
"graphile-build-pg": patch
---

Fix bug causing modifications to introspection results (e.g. fake constraints)
to be persisted to next watch tick via gather cache.
