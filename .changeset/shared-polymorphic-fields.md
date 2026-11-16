---
"grafast": patch
"graphile-build-pg": patch
---

Plan the fields shared by the types of an abstract position once instead of once
per type: equivalent `ConnectionStep`s deduplicate, each argument's default
value node is built once (so a field planned again reuses its argument steps), a
field that several polymorphic partitions plan to the same step is planned in
their combined layer plan (with one output plan when they select the same thing
beneath it), and relational polymorphic types plan their base table's relations
from the base record.
