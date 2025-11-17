# multistep

`multistep(specOrThunk, stable?)` normalises a loose collection of steps into a
single step that yields the same shape. Pass a step, tuple, object, `null`,
`undefined`, or a thunk returning those values and you will always receive a
step back. Tuples become a [`list`](./list.md), objects become an
[`object`](./object.md), isolated steps are returned untouched, and
`null`/`undefined` become [`constant`](./constant.md) steps.

:::tip

Declare tuple literals with `const` so that TypeScript keeps the tuple typing;
otherwise they will be widened to arrays and Gra*fast* cannot detect the
multistep tuple.

:::

`multistep` is especially helpful when writing APIs that accept "step or
multistep" arguments, such as `loadOne`, `loadMany`, `lambda`, and `sideEffect`.

## Arguments

- `specOrThunk` – the step, tuple, object, or thunk returning one of these
  values. Thunks run once at plan-time to avoid constructing intermediate steps
  when they are not needed.
- `stable` (optional) – pass `true`, a string identifier, or a
  `{ identifier, cacheSize }` object to forward cache metadata to the underlying
  list/object step. Use this when the multistep has a stable structure so that
  Gra*fast* can reuse cached plans.

## Usage

```ts
import { constant, context, loadOne, multistep } from "grafast";
import { usersByIdAndStatus } from "./loaders";

export const objects = {
  Query: {
    plans: {
      viewer() {
        const $context = context();
        const $viewerId = $context.get("viewerId");
        const $lookup = multistep(
          () => ({
            id: $viewerId,
            status: constant("active"),
          }),
          "userLookup",
        );
        return loadOne($lookup, usersByIdAndStatus);
      },
    },
  },
};
```

`multistep` can also be used to treat tuples as a single step, which is handy
for parameter lists:

```ts
const $range = multistep(() => [$min, $max] as const, "range");
```
