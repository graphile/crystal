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

:::tip

For the very best performance, you can pass a third argument `, true`, which
marks the lambda plan as "sync and safe"; but to do so your callback function
must not return any promises.

:::
