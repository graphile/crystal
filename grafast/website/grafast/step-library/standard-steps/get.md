# get

`get($step, attrName)` will return a step representing the attribute `attrName`
of step `$step`. It will do so by calling `$step.get(attrName)` if `$step` has a
`get` method, or falling back to `access($step, attrName)` if not.

Usage:

```ts
const $userId = get($user, "id");
```

:::danger

This could lead to unexpected results (which could introduce security issues) if
it is not used carefully; only use it on JSON-like data, preferably where the
objects have null prototypes, and only access keys that you trust (do not use
user-provided data for the path!)

Examples of potentially dangerous keys on general JS objects (non-exhaustive!):

- `constructor` / `prototype` / `__proto__`
- `toString` / `valueOf`
- `hasOwnProperty` / `isPrototypeOf`
- `__defineGetter__` / etc

:::

```ts
// Simplified definition
function get($step: Step, attr: string): Step {
  return "get" in $step && typeof $step.get === "function"
    ? $step.get(attr)
    : access($step, attr);
}
```
