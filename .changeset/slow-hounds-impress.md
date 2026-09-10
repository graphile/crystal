---
"graphile-build-pg": patch
"postgraphile": patch
---

Add opt-in `PgFunctionOverloadsPreset` which factors the input argument types
into function resource names (e.g. `code(pets)` becomes `code__pets`), enabling
support for overloaded functions such as computed column functions targeting
different tables. Without the preset, overloaded functions are skipped as
before; a warning is now logged when the skipped overloads look like computed
columns.
