---
"graphile-build-pg": patch
---

Fix a `@ref` whose single `@refVia` path leads to a `@unionMember` union
resolving to `null`. Such a ref is now planned via `pgUnionAll`, like a ref with
several paths, so that `__typename` is available to resolve the member type.
