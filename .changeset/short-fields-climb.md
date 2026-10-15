---
"graphile-build-pg": patch
---

Computed fields (functions that accept a table's row) of a polymorphic table
(`@interface mode:single` or `mode:relational`) are now also added to its
interface, not only to its implementations; and for `mode:relational` the
implementations now have the computed fields of the root table too (they read
them from the root's row).
