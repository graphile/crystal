---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug recognizing the required-ness of arguments to functions that use `inout`
or `returns table` - this particularly affects people using `pgStrictFunctions`
and should result in a couple of required arguments becoming nullable.
