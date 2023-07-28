---
"graphile-build-pg": patch
"postgraphile": patch
---

Deprecate `preset.gather.pgJwtType` (tuple), instead use
`preset.gather.pgJwtTypes` which expects a string and parses it similar to the
PostgreSQL parser (and also allows multiple types to be specified).
