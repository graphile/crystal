---
"graphile-build-pg": patch
---

Ensures that the `condition` argument is added before the `orderBy` argument is
added. This was necessary due to postgraphile-plugin-fulltext-filter wishing to
order by the result of having added a condition (so adding the condition must
come first).
