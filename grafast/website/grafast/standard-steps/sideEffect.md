# sideEffect

Accepts a step/[multistep](./multistep.md) and a callback; returns a step
representing calling the callback for each runtime value of the step.

The callback is expected to have a side effect (change data or state on the
backend), if your callback doesn't have any side effects then consider using
[`lambda`](/grafast/standard-steps/lambda) instead, it has a very
similar API.

:::danger[Side effects should be constrained to root mutation fields]

Side effects, according to the GraphQL spec, are only allowed to occur in the
root selection set of a GraphQL mutation operation (i.e. on the fields of the
mutation operation root type). Similarly, Gra*fast* only expects side effects
here; side effects in other locations in the plan may have unexpected
repercussions.

That said, we aim for them to work elsewhere (they can be useful for debugging
or certain other non-user-observable actions), so should you have issues with
side effects in other places, please create a minimal reproduction and file an
issue.

:::

`sideEffect` does not perform batching; it is only intended for performing
mutations, and mutations rarely batch.

:::tip[Mark any step as having side effects]

Almost any step can be made to be treated as having side effects by setting
`$step.hasSideEffects = true`, so if you require batching in your mutations
consider using an alternative step, such as
[`loadOne()`](/grafast/standard-steps/loadOne) and explicitly
marking it as having side effects:

```ts
const $random = loadOne([$min, $max], (tuples) =>
  tuples.map(([min, max]) => min + Math.floor(Math.random() * (max - min + 1))),
);
$random.hasSideEffects = true;

return $random;
```

:::

## Usage

```ts
function sideEffect<TIn extends Multistep, TOut>(
  $input: TIn,
  callback: (input: UnwrapMultistep<TIn>) => TOut | Promise<TOut>,
): Step<TOut>;
```

## Examples

### Single step

```ts
const $logout = context().get("logout");
sideEffect($logout, (logout) => logout());
```

### No input

If your callback doesn't need any input then you can pass `null` or `undefined`
instead of a step.

```ts
sideEffect(null, () => console.log(new Date().toISOString()));
```

### Multistep - tuple

If you need to pass multiple steps, you can pass a list:

```ts
sideEffect(
  // Tuple of dependencies
  [$login, $username, $password],
  // becomes a tuple in callback:
  ([login, username, password]) => login(username, password),
);
```

### Multistep - object

If you need to pass multiple steps, you can pass an object:

```ts
sideEffect(
  // Object of dependencies
  { login: $login, username: $username, password: $password },
  // becomes an object in callback:
  ({ login, username, password }) => login(username, password),
);
```
