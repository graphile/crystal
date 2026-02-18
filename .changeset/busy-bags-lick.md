---
"@graphile/simplify-inflection": patch
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Significantly reduce the size of a PostGraphile exported schema (around 20%
reduction on test fixtures) by mark optional things as optional, and excluding
many optional things from being specified in configuration objects.

In particular:

- `extensions.tags` is now marked optional.
