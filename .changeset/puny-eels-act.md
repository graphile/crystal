---
"grafast": patch
---

Add `const refId = this.addRef($other);` and
`const $other = this.getRef(refId);` APIs to steps, to allow referencing
ancestor steps at plan-time only. Useful for optimization.
