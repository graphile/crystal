---
"postgraphile": patch
"grafast": patch
---

Grafast operation cache now tied to the schema, so multiple schemas will not
cause degraded performance from clearing the cache.
