# lambda

Takes the input step and feeds each value through the given callback.

```ts
const $oneBasedIndex = lambda($zeroBasedIndex, (n) => n + 1);
```

:::note

If you need to pass more than one value, pass a `ListStep`; e.g.

```ts
const $aPlusB = lambda(list([$a, $b]), ([a, b]) => a + b);
```

:::
