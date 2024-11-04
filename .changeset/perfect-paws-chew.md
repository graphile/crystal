---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug recognizing the required-ness of arguments to functions using `out` args
or `returns table` - this particularly affects people using `pgStrictFunctions`
and should result in a couple of required arguments becoming nullable.
