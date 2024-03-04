---
"@dataplan/json": patch
"@dataplan/pg": patch
"grafast": patch
---

The signature of `ExecutableStep.execute` has changed; please make the following
change to each of your custom step classes' `execute` methods:

```diff
- async execute(count: number, values: any[][], extra: ExecutionExtra) {
+ async execute({ count, values: newValues, extra }: ExecutionDetails) {
+   const values = newValues.map((dep) =>
+     dep.isBatch ? dep.entries : new Array(count).fill(dep.value)
+   );
    // REST OF YOUR FUNCTION HERE
  }
```

For more details, see: https://err.red/gev2
