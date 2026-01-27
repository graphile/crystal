---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
---

Fix various places where `inflection.builtin()` was not called, and thus changes
to builtin inflection were not reflected. (Also adds test to prevent
regression.)
