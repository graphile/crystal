---
"grafast": patch
---

Throw better errors when a step class calls `this.addDependency(...)` but
doesn't actually pass a step to depend on. (Previously: "cannot access property
`layerPlan` of undefined" or similar errors were thrown.)
