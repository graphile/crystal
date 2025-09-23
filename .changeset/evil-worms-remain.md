---
"@dataplan/pg": patch
"grafast": patch
---

`Step::dependencies` is now explicitly internal (removed from API), no longer
simply protected. Use `Step::dependencyCount` along with
`Step::getDep()`/`Step::getDepOptions()` instead.
