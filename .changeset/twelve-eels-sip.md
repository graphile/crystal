---
"postgraphile": patch
"grafast": patch
---

Fix a bug in `connection()` where adding pagination arguments (e.g. `first: 0`)
for a connection over a full-pagination-support step would force the underlying
collection to fetch even when none of the data was needed for rendering (e.g. no
`nodes`/`edges`/`pageInfo` requested). This is particularly relevant to
PostGraphile queries such as `{ allRows(first: 0) { totalCount } }` which would
incorrectly issue two SQL queries instead of one.
