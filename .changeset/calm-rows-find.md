---
"graphile-build-pg": patch
---

Add the root query fields that fetch a single row by a unique key (for example
`itemById` or `itemByRowId`) for the interface of a `mode:single` or
`mode:relational` polymorphic table. Previously they were only added for object
types, so such a table lost them when it became an interface; the concrete type
of the row is resolved as usual.
