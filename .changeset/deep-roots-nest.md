---
"graphile-build-pg": patch
---

Support a relational polymorphic table (`@interface mode:relational`) that is
itself one of the types of another relational polymorphic table, to any depth.
Previously such a schema failed to build
(`Interface field <Root>.<field> expected but <Leaf> does not provide it`). A
row is now resolved to the leaf type it is by following the type attributes down
the chain, every leaf implements the interface of each table above it, and each
interface implements the interface of the table it belongs to.
