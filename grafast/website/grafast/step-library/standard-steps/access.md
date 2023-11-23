# access

Accesses a (potentially nested) property from the result of a source step.

:::warning

`access()` bypasses `.get()` / `.at()`, so you should only use it where doing
so is truly what you mean. Always use a step's `.get()` or `.at()` if present
unless you know better.

Many steps require that you use `.get()` or `.at()` in order to function
properly, for example if you don't call `.get('attribute_name')` on a [`loadOne()`
step](./loadOne.md) then it won't know to request the `attribute_name` attribute,
and you may end up with unexpected nulls/undefineds.

:::

Usage:

```ts
const $userId = access($user, "id");
const $firstPatchUserId = access($args.get("input"), [
  "patches",
  0,
  "user",
  "id",
]);
```

:::warning

This could lead to unexpected results (which could introduce security issues) if
it is not used carefully; only use it on JSON-like data, preferably where the
objects have null prototypes, and only access keys that you trust (do not use
user-provided data for the path!)

:::

An `AccessStep` has the following methods:

- `.get(key)` - gets the value for the key `key` assuming the parsed JSON value
  was an object
- `.at(index)` - gets the value at index `index` assuming the parsed JSON value
  was an array

```ts
function access<TData>(
  $source: ExecutableStep<unknown>,
  path: (string | number)[] | string | number,
  fallback?: any,
): AccessStep<TData>;
```
