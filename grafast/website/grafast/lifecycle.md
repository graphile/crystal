---
sidebar_position: 9
---

# Lifecycle

1. Start at the root selection set.
1. For each field in the current selection set:
   1. Call field plan resolver
   1. For each argument:
      1. Call arg plan resolver
      1. Call input object field plan resolvers (recursively)
   1. **Deduplicate** new steps
   1. Repeat step 2 using field's selection set
1. **Optimise**
1. **Finalise**
