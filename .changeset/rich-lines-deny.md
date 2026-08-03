---
"grafast": patch
"postgraphile": patch
---

Fix types in `loadOne`/`loadMany` that were allowing steps to become
`Step<Promise<TData>>` rather than `Step<TData>`. Steps will never represent a
promise.
