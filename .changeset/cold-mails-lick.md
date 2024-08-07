---
"graphile-build-pg": patch
"postgraphile": patch
---

Fixed a bug in 'relational' polymorphism where relations to each of the concrete
types would non-sensically be added to each of the concrete types.
