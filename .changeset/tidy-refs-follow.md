---
"graphile-build-pg": patch
---

Fix a `@ref` declared on the root of a relational polymorphic table
(`@interface mode:relational`) failing the schema build with
`Interface field <Root>.<ref> expected but <Variant> does not provide it`. The
root's refs are now carried to each implementation (reached via the root), so
the interface's fields are all provided.
