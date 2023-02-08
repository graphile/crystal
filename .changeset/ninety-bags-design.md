---
"postgraphile": patch
"graphile-config": patch
---

Better graphile.config.\* compatibility with ESM-emulation, so 'export default
preset;' should work in TypeScript even if outputting to CommonJS.
