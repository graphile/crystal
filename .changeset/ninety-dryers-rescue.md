---
"graphile-build-pg": patch
---

Use `file://` URLs in import() to fix compatibility with Windows (e.g. when
loading `graphile.config.mjs`).
