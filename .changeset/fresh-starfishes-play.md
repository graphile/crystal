---
"grafast": patch
---

In addition to `GraphQLArgs`, `grafast` now accepts `resolvedPreset` and
`requestContext`; if both of these are set then `grafast` will perform
`hookArgs` for you, this makes running tests a lot less boiler-plate-y (you no
longer need to `parse`/`validate`/`execute` - just `grafast`).
