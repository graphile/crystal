---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Now possible to filter by relay node identifiers without weird results if you
pass an incompatible node id (e.g. a 'Post' ID where a 'User' ID was expected) -
significantly improves the Relay preset.
