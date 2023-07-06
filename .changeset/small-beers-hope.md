---
"graphile-build-pg": patch
"postgraphile": patch
---

Remove relations from mutation payloads (unless using V4 preset) - they're
redundant.
