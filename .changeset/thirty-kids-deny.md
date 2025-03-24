---
"grafast": patch
---

makeGrafastSchema format now allows for `apply()` functions to be directly
provided for input fields and enum values, plus `applyPlan()` functions for
field arguments. Many places are now grafast-centric again with `extensions` as
an optional extra field (rather than exporting `extensions` directly, which is
much less friendly).
