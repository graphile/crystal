---
"pg-sql2": patch
---

`sql.getIdentifierSymbol(node)` method added to extract a symbol from an
identifier node (if a node is an identifier node, otherwise return `null`).
