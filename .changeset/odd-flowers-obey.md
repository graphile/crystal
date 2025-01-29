---
"postgraphile": patch
"@dataplan/pg": patch
---

PgSelectStep and PgUnionAllStep now return objects rather than arrays/streams;
thanks to the new Grafast .items() method and these classes being "opaque" steps
this is _mostly_ a non-breaking change.
