---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Fixes a bug where ordering or filtering by 'via' attributes (such as those from
polymorphic 'relational' tables) resulted in an error.
