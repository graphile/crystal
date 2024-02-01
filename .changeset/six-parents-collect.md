---
"postgraphile": patch
"graphile-export": patch
---

Automatically detect when a `graphile-export` export is invalid, and throw an
error indicating which method needs to have `EXPORTABLE` added around it.
