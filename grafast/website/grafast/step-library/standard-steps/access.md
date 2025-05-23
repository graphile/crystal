# access

Creates a step representing a (potentially nested) property from the result of a
source step _without informing the step you're accessing it_. In general, you
should prefer [`get()`](./get).

:::warning

Many steps require that you use `.get()` or `.at()` in order to function
properly, for example if you don't call `.get('attribute_name')` on a [`loadOne()`
step](./loadOne.md) then it won't know to request the `attribute_name` attribute,
and you may end up with unexpected nulls/undefineds.

`access()` bypasses the step's `.get()` / `.at()` methods, which may mean that
vital data is not fetched from the origin. **You should only use `access()` where
doing so is truly what you mean.** Always use a step's `.get()` or `.at()` if
present unless you know better.

The [`get()`](./get) step will automatically
call `$step.get(attr)` for you if it can, and fall back to `access($step, attr)`
if not, so it's generally much safer to use `get()` rather than `access()`.

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

Examples of potentially dangerous keys on general JS objects (non-exhaustive!):

- `constructor` / `prototype` / `__proto__`
- `toString` / `valueOf`
- `hasOwnProperty` / `isPrototypeOf`
- `__defineGetter__` / etc

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
