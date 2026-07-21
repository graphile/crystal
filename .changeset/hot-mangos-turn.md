---
"graphile-build-pg": patch
---

Changes `proc:filterBy` behavior to `condition:proc:filterBy` so that
postgraphile-plugin-connection-filter can use `filter:proc:filterBy` and they
can be controlled independently
