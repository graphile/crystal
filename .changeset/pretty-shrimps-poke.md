---
"pg-sql2": patch
---

Experimental: expose `symbolToIdentifier` on `sql.compile()` result (via special
`$$symbolToIdentifier` symbol key) so you can determine which identifiers were
used for which symbols.
