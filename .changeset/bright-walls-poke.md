---
"@dataplan/pg": patch
"postgraphile": patch
---

Fix bug in `loadOneWithPgClient` and `loadManyWithPgClient` where the PG client
might be released early if the loader returns a list of promises (or promise to
the same). Solution is simple: wrap the list with `Promise.all(...)`.
