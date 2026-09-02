---
"graphile-utils": patch
---

`extendSchema()` and `wrapPlans()` now `provides: ['extendSchema']` and
`['wrapPlans']` respectively; this can help with plugin ordering concerns.
