---
"grafast": patch
"postgraphile": patch
---

🚨 **BREAKING CHANGE** `hookArgs()` now accepts arguments in the same order as
`grafast()`: `hookArgs(args, resolvedPreset, ctx)`. Please update all your
`hookArgs` calls.
