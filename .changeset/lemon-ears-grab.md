---
"graphile-build-pg": patch
"postgraphile": patch
---

🚨 Amber preset no longer enables backward pagination options (`before`, `last`)
on functions by default - add `+backwards` behavior to these functions to
enable. If you're using the V4 preset you should be unaffected by this change
because it enables `+backwards` by default.
