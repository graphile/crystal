---
"pg-sql2": patch
---

Fix bug causing unhelpful throw on $$type optimization on null - instead pass
through to more helpful throw.
