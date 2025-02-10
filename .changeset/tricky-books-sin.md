---
"ruru": patch
---

`ruru/server` no longer uses `fs` module to read data/version from disk, instead
data is bundled in source files. This may aid people attempting to bundle ruru.
