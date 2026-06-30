---
"graphile-config": minor
"ruru": patch
"pgl": patch
"postgraphile": patch
"graphile": patch
---

CLIs will now correctly auto-import `graphile.config.mts` files (previously
`graphile.config.ts` files worked, but `graphile.config.mts` files would be
ignored). With all major versions of Node.js now having native support for type
stripping and require(esm), we recommend moving your configuration files to
TypeScript (using ESM and erasable syntax only).
