---
"grafast": patch
---

Add `operationPlan().withRootLayerPlan(() => ...)` method to force steps to plan
in root layer plan (forces them to be unary, ignores side effect steps).
