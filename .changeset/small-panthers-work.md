---
"@grafserv/persisted": patch
---

Use an LRU for caching the getter from options - prevents memory exhaustion in
the case of poorly written consumer code.
