---
"graphile-build": patch
"postgraphile": patch
---

The `minify` preset and MinifySchemaPlugin now enable you to configure if you'd
like descriptions (default: true), deprecation reasons (default: true) and
deprecated entities (default: false) dropped from the schema on minify.
