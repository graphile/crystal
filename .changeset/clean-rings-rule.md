---
"graphile-export": patch
---

Graphile Export now auto-detects that a function has additional properties set,
and makes sure these properties are exported too. (Typically this is
`fn.isSyncAndSafe=true` for Grafast optimization.)
