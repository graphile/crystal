---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
"graphile-config": patch
---

Use `file://` URLs in import() to fix compatibility with Windows (e.g. when
loading `graphile.config.mjs`)
