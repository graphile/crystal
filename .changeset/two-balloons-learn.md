---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
"graphile-config": patch
---

`disablePlugins` now supports TypeScript auto-completion of known plugin names.
Other names are still accepted without error, so this is just a minor DX
improvement rather than type safety.
