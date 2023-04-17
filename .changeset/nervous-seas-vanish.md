---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Single table inheritance no longer exposes non-shared columns via
condition/order, and also only exposes the relationships on the types where they
are appropriate.
