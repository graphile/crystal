---
"grafast": patch
---

Improve rendering of mermaid diagrams:

- Don't render dependencies on the `undefined` constant, because it's messy
- Group when there are multiple dependencies to the same step from the same
  step, and label the line with the count instead.
