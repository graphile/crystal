---
"pg-introspection": patch
"postgraphile": patch
---

If an issue occurs whilst retrieving attributes for a constraint, we now log an
error and return an empty array.
