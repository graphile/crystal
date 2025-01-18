---
"@dataplan/pg": patch
---

Move SQL construction to runtime rather than plantime. Get rid of
`textForSingle` since we compile the SQL at runtime so we don't need to handle
both cases. Add `$pgSelect.deferredSQL()` API to allow plans to yield (safe,
thanks to pg-sql2) SQL to be composed into the query at runtime.
