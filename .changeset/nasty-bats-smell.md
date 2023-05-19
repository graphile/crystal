---
"grafast": patch
---

Various optimizations of the Gra*fast* plan by converting things to constants
where possible.

- `Step.optimize()` is now passed a `meta` object if the step sets
  `optimizeMetaKey`; this object can store planning-only values and share across
  a step family.
- `__InputStaticLeafStep` now optimizes down to a constant
- `ListStep` where every entry in the list is a constant is now automatically
  replaced with a `ConstantStep` representing the final list
- `ObjectStep` where all the values are `ConstantStep` is now replaced with a
  `ConstantStep`
- `ConstantStep` can now deduplicate with other constant steps with the exact
  same value
- `OperationPlan.optimizeStep()` now also re-deduplicates the step if it
  supports multiple optimizations
- `ConstantStep` now has `toStringMeta` to represent the constant value in the
  plan diagram
- When each step is processed (but not by deduplicate) we'll automatically try
  and deduplicate any new steps created
