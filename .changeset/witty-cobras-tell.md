---
"grafast": patch
---

🚨 `connection()` step no longer guarantees the incoming step for
first/last/before/after/offset are InputStep - you must NOT use `$input.eval*()`
methods - instead add the values as dependencies and evaluate them at runtime
like any other step.
