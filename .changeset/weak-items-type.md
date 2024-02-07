---
"graphile-build": patch
"graphile-export": patch
"postgraphile": patch
---

Exporting a schema now performs ESLint 'no-use-before-define' check to catch
even more invalid export conditions. Fix `registerNodeIdCodec` calls caught by
this.
