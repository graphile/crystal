---
"graphile-build-pg": patch
"postgraphile": patch
---

Use `inhibitOnNull` when decoding a spec ID to prevent it being consumed if
invalid (e.g. don't allow using a 'Post' node ID to fetch a 'Person' record).
