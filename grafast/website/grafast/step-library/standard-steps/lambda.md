# lambda

Takes the input step (or array of steps, or nothing) as the first argument, a
callback as the second argument, and returns a step that represents the result
of feeding each value (or array of values, or nothing) through the given
callback.

The callback should perform a calculation, or may fetch data, but must not have
side effects. If you need to do something with side effects use
[`sideEffect()`](/grafast/step-library/standard-steps/sideEffect) instead
(which has a very similar API).

If you are 100% certain that your callback function:

1. does not do any asynchronous work (no promises),
2. does not have any side effects,
3. will not throw an error

then for the very best performance, you can pass the third argument,
[`isSyncAndSafe`](../../step-classes.md#issyncandsafe), as the value `true`. Do not do this unless you are certain!

## Single dependency version

```ts
function lambda<T, R>(
  $input: ExecutableStep<T>,
  callback: (input: T) => R | Promise<R>,
  isSyncAndSafe = false,
): ExecutableStep<R>;
```

### Example

```ts
// Takes a step representing a zero-based index, and converts it to a one-based
// index by adding one to it.
const $oneBased = lambda($zeroBased, (zeroBased) => zeroBased + 1, true);
```

## Dependency-free version

If your callback doesn't need any input then you can pass `null` or `undefined`
instead of a step.

```ts
function lambda<R>(
  $input: null | undefined,
  callback: () => R | Promise<R>,
  isSyncAndSafe = false,
): ExecutableStep<R>;
```

## Multiple dependencies version

If you need to pass multiple steps, you can use the
[`list()`](/grafast/step-library/standard-steps/list) step to do so:
`lambda(list([$a, $b, $c]), ([a, b, c]) => a + b + c)`.

If you'd prefer to save a few characters you can pass the array of steps
directly and we'll automatically wrap it in `list()` for you:

```ts
function lambda<Tuple extends [...any[]], R>(
  // i.e. $input: ExecutableStep[],
  $input: { [Index in keyof Tuple]: ExecutableStep<Tuple[Index]> },
  callback: (input: Tuple) => R | Promise<R>,
  isSyncAndSafe = false,
): ExecutableStep<R>;
```

### Example

```ts
// Passing an array of steps gives you the values as an array:
const $aPlusB = lambda([$a, $b], ([a, b]) => a + b, true);
```

## Warning: no batching!

**`lambda` is an escape hatch** that breaks you out of Gra*fast*'s batching;
you should only use it for the most trivial of operations (i.e. synchronous JS
code that doesn't perform heavy computation and wouldn't benefit from
batching).

In most cases, you should use [`loadOne`](./loadOne) instead. Here's what the
examples above might look like with `loadOne` - note that these callbacks
are now called with all the values at once, rather than one at a time:

```ts
const $oneBasedIndex = loadOne($zeroBasedIndex, (allN) =>
  allN.map((n) => n + 1),
);

const $aPlusB = loadOne([$a, $b], (allAsAndBs) =>
  allAsAndBs.map(([a, b]) => a + b),
);
```
