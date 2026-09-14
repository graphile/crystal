---
"graphile-build-pg": patch
"postgraphile": patch
---

Fixes bug in "Reads and enables pagination through a set of ..." message (Int4
-> Int, Int8 -> BigInt, honours inflection for types, etc)
