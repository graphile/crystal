---
"postgraphile": patch
"@dataplan/pg": patch
---

SQL is now generated in a slightly different way, helping PostgreSQL to optimize
queries that have a batch size of 1. Also removes internal mapping code as we
now simply append placeholder values rather than search and replacing a symbol
(eradicates `queryValuesSymbol` and related hacks). If you manually issue
queries through `PgExecutor` (_extremely_ unlikely!) then you'll want to check
out PR #270 to see the differences.
