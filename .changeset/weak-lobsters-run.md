---
"grafast": patch
---

🚨 The step class expression `this.addDependency(step, true)` is no longer
supported; instead (and equivalently) please use:
`this.addDependency({ step, skipDeduplication: true })`. Note
`this.addDependency(step)` (with no additional arguments) is unaffected.
