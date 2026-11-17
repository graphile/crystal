---
"graphile-build-pg": patch
---

A relational polymorphic type plans its base table's relations from its record
(through the base attributes it exposes `via` the base relation) instead of
joining the base table again by its own key, so every type of the interface
plans the same steps and fewer SQL queries are issued.
