---
"grafast": patch
---

Implement planning and execution timeouts; add the following to your preset (the
second argument to `grafast()` or `execute()`):

```ts
const preset = {
  grafast: {
    timeouts: {
      /** Planning timeout in ms */
      planning: 500,

      /** Execution timeout in ms */
      execution: 30_000,
    },
  },
};
```
