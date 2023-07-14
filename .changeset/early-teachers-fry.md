---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
---

`codec` is now baked into NodeId handlers (rather than using `codecName` and
looking that up in `codecs`). All related APIs have thus simplified, e.g. the
step `node(codecs, handler, $id)` is now `node(handler, $id)`, etc. TypeScript
should point out any issues you have hopefully.
