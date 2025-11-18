# lambda

:::warning[`lambda` is an escape hatch!]

Lambda does not perform batching (see [Warning: no
batching!](#warning-no-batching)). It's highly suitable for usage when you just
want to synchronously transform data (e.g. concatenating strings, mapping over
arrays, etc) but is almost never well suited to asynchronous topics &mdash; you
likely want [`loadOne()`](./loadOne.md) or [`loadMany()`](./loadMany.md) instead
in those cases.

:::

Accepts a step (or [multistep](./multistep.md)) and a callback; returns a step
that represents calling the callback for each runtime value of the step.

## Usage

```ts
function lambda<TIn extends Multistep, TOut>(
  $input: TIn,
  callback: (input: UnwrapMultistep<TIn>) => TOut | Promise<TOut>,
  isSyncAndSafe = false,
): Step<TOut>;
```

- `$input` is a step or [multistep](./multistep.md)
- `callback` is a function that takes the runtime values from `$input` and
  returns a derivative
- `isSyncAndSafe` should only be specified if you are certain (see note below)

:::tip Define callback in top scope

Don't define callback inline, otherwise it cannot be deduplicated. Instead define
it at the top scope of your file (or import from another file):

```ts
function fullname([firstName, lastName]: [string, string]): string {
  return `${firstName} ${lastName}`;
}

const objects = {
  User: {
    plans: {
      fullName($user) {
        const $firstName = $user.get("firstName");
        const $lastName = $user.get("lastName");

        // Similar calls to lambda can be deduplicated because `fullname`
        // function is not redefined each call, instead the same reference
        // persists between calls
        return lambda([$firstName, $lastName], fullname, true);
      },
    },
  },
};
```

:::

:::danger Callback must not have side effects

The callback must not have side effects. If you need to do something with side
effects use [`sideEffect()`](/grafast/standard-steps/sideEffect)
instead (which has a very similar API).

:::

:::tip Optimization: `isSyncAndSafe`

If you are 100% certain that your callback function:

1. does not do any asynchronous work (no `Promise`/`async`),
2. does not have any side effects,
3. will not throw an error

then for the very best performance, you can pass the third argument,
[`isSyncAndSafe`](../step-classes.mdx#issyncandsafe), as the value `true`. Do
not do this unless you are certain!

:::

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

:::note Using `lambda` does not break batching of dependents

Even though `lambda()` itself does not perform batching, Gra*fast* will wait for
all values to be processed before running dependents. From the dependents
perspective it's as if lambda did batch, and they will batch as normal.

In other words: usage of `lambda()` does not cause Gra*fast* to go into the same
exponential query explosion that native GraphQL.js resolvers frequently suffer
from.

:::

## Examples

### Single step

Typical usage passes a step and gets a new step back:

```ts
// Takes a step representing a zero-based index, and converts it to a one-based
// index by adding one to it.
const $oneBased = lambda($zeroBased, (zeroBased) => zeroBased + 1, true);
```

### No input

Sometimes you don't need dependencies (though in many cases `sideEffect` may be
better suited here - e.g. `Math.random()` and `new Date()` don't require
dependencies but do change each time you call them, so you may not want to
deduplicate.

```ts
const $hostname1 = lambda(null, () => os.hostname());
// The above is equivalent to
const $hostname2 = lambda(constant(null), () => os.hostname());
```

### Multistep - tuple

If you need to pass multiple steps, you can use the
[`list()`](./list.md) or [`object()`](./object.md) steps to do so.

To save a few characters you can pass the list of steps directly and we'll
automatically wrap it in `list()` for you via [`multistep()`](./multistep.md):

```ts
// Passing an array of steps gives you the values as an array:
const $aPlusB1 = lambda([$a, $b], ([a, b]) => a + b, true);
// The above is equivalent to:
const $aPlusB2 = lambda(list([$a, $b]), ([a, b]) => a + b, true);
```

### Multistep - object

Objects can be clearer than tuples by allowing you to label each value:

```ts
// Passing an object of steps gives you the values as an object:
const $aPlusB1 = lambda({ a: $a, b: $b }, ({ a, b }) => a + b, true);
// The above is equivalent to:
const $aPlusB2 = lambda(object({ a: $a, b: $b }), ({ a, b }) => a + b, true);
```
