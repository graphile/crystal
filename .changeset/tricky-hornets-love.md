---
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"postgraphile": patch
"graphile-export": patch
"@dataplan/pg": patch
"grafast": patch
"tamedevil": patch
---

EXPORTABLE now accepts a third argument, `nameHint`, which is used to hint what
variable name to use for the given value. Used this in `graphile-export` along
with some fixes and optimizations to improve the exports further.
