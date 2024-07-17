---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug in orderBy planning that caused a new plan to be required for every
request.
