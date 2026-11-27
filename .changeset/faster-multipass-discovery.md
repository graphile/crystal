---
"pg-introspection": patch
"graphile-build-pg": patch
"graphile-utils": patch
"postgraphile": patch
---

Reduces database round trips during multipass introspection, including when
discovering multi-hop `@ref` paths.
