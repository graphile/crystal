---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
"@dataplan/pg": patch
"grafast": patch
---

Steps are now prevented from calling other steps' lifecycle methods.
GRAPHILE_ENV is actively encouraged, and falls back to NODE_ENV.
