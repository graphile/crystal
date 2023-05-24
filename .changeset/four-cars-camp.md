---
"grafast": patch
---

Default plan resolver will now use `$parent.get(fieldName)` if $parent has a get
method, falling back to old `access()` behavior if not.
