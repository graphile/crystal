---
"graphile-build-pg": patch
"postgraphile": patch
"grafast": patch
---

Fix a bug relating to Global Object Identifiers (specifically in update
mutations, but probably elsewhere too) related to early exit.
