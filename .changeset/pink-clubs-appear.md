---
"graphile-build-pg": patch
"graphile-build": patch
"@dataplan/json": patch
"graphile-config": patch
"@dataplan/pg": patch
"grafast": patch
"graphile": patch
"grafserv": patch
"graphile-utils": patch
"pgl": patch
"postgraphile": patch
---

The minimum version of Node supported is now 22.12.0 for `require(esm)` support
unflagged (should still work with Node 22.0 via `--experimental-require-module`
flag).
