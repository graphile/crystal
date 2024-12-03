---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Overhaul how PostgreSQL arrays are handled, and fix the "empty arrays become
null" bug caused by using `array_agg()`.
