---
"graphile-build-pg": patch
"postgraphile": patch
---

Fixes multiple pgServices codec name conflicts by prepending the service name if
it's not 'main'.
