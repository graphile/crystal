---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Prevents inlining (via joins) child PgSelect queries into parents when the
parent is relying on implicit ordering coming from a function or suitably
flagged subquery.
