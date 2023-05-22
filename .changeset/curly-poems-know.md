---
"grafast": patch
---

- Adjust OutputPlan printing
- Fix `path` used to track planning errors
- Fix tree shaking when eradicating all steps in a LayerPlan
- Don't `deduplicateSteps()` when printing the plan graph 🤣
- `each()` can now be as connection capable as the list plan was (via
  delegation)
