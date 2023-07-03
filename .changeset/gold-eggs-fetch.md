---
"postgraphile": patch
"@dataplan/pg": patch
"grafast": patch
---

Incremental delivery will no longer deliver payloads for paths that don't exist
when an error is thrown in an output plan.
