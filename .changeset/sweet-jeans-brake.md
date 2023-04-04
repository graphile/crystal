---
"postgraphile": patch
"@dataplan/json": patch
"@dataplan/pg": patch
"grafast": patch
---

The Grafast step class 'execute' and 'stream' methods now have a new additional
first argument `count` which indicates how many results they must return. This
means we don't need to rely on the `values[0].length` trick to determine how
many results to return, and thus we can pass through an empty tuple to steps
that have no dependencies.
