---
"graphile-build-pg": patch
"postgraphile": patch
---

`build.getTypeMetaByName` now returns a TypeScript union of TypeMeta that
differentiates over
`{kind: "OBJECT" | "INTERFACE" | "UNION" | "SCALAR" | "ENUM" | "INPUT_OBJECT", ...}`,
allowing you to get a typed `scope` by simply asserting the `typeMeta.kine`
you're expecting.
