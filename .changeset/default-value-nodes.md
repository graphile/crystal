---
"grafast": patch
---

Build each argument's default value node once per operation plan, so a field
planned more than once gets the same argument steps and `processPlanField` can
plan it once.
