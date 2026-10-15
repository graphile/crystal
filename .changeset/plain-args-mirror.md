---
"graphile-build-pg": patch
---

Add the `condition` and `orderBy` arguments (and `orderBy`'s default value) to
connection and list fields of interfaces, as well as to those of object types.
Previously a field such as a `@ref` on a polymorphic interface had fewer
arguments than the same field on each of the interface's implementations.
