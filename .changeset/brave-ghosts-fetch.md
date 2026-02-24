---
"graphile-export": patch
---

Graphile Export now optimizes the code further by detecting the parameters of
functions that are always called with the same values and eliminating them.
Further optimizations have also been applied: Graphile Export now requires fewer
passes to achieve the same results and more optimizations to the exported code
are now applied.
