---
"postgraphile": patch
"grafast": patch
---

`preset.grafast.context` second parameter is no longer the existing GraphQL
context, but instead the GraphQL request details (which contains the
`contextValue`). If you were using this (unlikely), add `.contextValue` to usage
of the second argument.
