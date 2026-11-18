---
"@dataplan/pg": patch
---

Fix cursor pagination over a nullable order dropping the NULL rows: the
one-is-null branch of the cursor condition was inverted, so `after` on an ASC
(NULLS LAST) order skipped every NULL row, and `after` on a DESC (NULLS FIRST)
order from a NULL cursor returned nothing.
