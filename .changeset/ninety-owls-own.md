---
"postgraphile": minor
"@dataplan/pg": minor
---

`PgSelectStep` now allows influencing the inlining strategy used to inline one
query into a parent: `preferLeftJoin`, `preferSubquery`, `auto` or `forbidden`.
The auto behavior (default) is now smarter: rather than always using a left join
where possible (as before), the system will now aim to have no more than 7 joins
(to avoid combinatorics pressure in PostgreSQL query planning) and will also not
use a left join to inline a PgSelectStep that itself has joins, inlined
children, or `.apply()`s - instead a subquery will be used. This will likely
impact your query performances (hence semver minor) but hopefully in a positive
way - especially if you have large queries with lots of to-one relations at many
depths.
