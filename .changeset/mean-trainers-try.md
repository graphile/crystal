---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Fix issues around enum tables: indicate when an enum table codec replaces a
regular attribute codec, expose helpers for working with enum tables, and don't
exclude enum table references when using the Relay preset.
