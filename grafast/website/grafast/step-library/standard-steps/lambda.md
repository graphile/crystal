# lambda

Takes the input step (or array of steps) and feeds each value (or array of
values) through the given callback.

```ts
// Passing a single step gives you the value directly:
const $oneBasedIndex = lambda($zeroBasedIndex, (n) => n + 1);

// Passing an array of steps gives you the values as an array:
const $aPlusB = lambda([$a, $b], ([a, b]) => a + b);
```

:::warning

**`lambda` is an escape hatch** that breaks you out of Gra*fast*'s batching;
you should only use it for the most trivial of operations (i.e. synchronous JS
code that doesn't perform heavy computation and wouldn't benefit from
batching).

In most cases, you should use [`loadOne`](./loadOne) instead. Here's what the
examples above might look like with `loadOne`:

```ts
const $oneBasedIndex = loadOne($zeroBasedIndex, (allN) =>
  allN.map((n) => n + 1),
);

const $aPlusB = lambda(list([$a, $b]), (allAsAndBs) =>
  allAsAndBs.map(([a, b]) => a + b),
);
```

:::

:::tip

If your callback function:

1. does not do any asynchronous work (no promises), and
2. does not have any side effects

then for the very best performance, you can pass a third argument `, true`, which
marks the lambda plan as "sync and safe".

:::
