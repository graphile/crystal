---
"graphile-utils": patch
---

Expose `nullable?: boolean` as an orderByAscDesc option, and default it true if
'nulls' is set. Vital if you're ordering by nullable things!
