---
"pg-sql2": patch
---

Don't allow recursion when calling `node[$$toSQL]()`; customize error message if
`$$toSQL` was invoked.
