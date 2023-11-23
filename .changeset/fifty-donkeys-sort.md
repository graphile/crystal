---
"grafast": patch
---

Fixes a bug in loadOne/loadMany where ioEquivalence for objects doesn't work
right. Also now requires that `$obj.get('...')` rather than
`access($obj, '...')` is used with loaded records in order to get attributes
(consistency fix).
