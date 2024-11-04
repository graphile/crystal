# sideEffect

Takes the input step (or array of steps, or nothing) as the first argument, a
callback as the second argument, and returns a step that represents the result
of feeding each value (or array of values, or nothing) through the given
callback.

The callback is expected to have a side effect (change data or state on the
backend), if your callback doesn't have any side effects then consider using
[`lambda`](/grafast/step-library/standard-steps/lambda) instead, it has a very
similar API.

:::info

Side effects, according to the GraphQL spec, are only expected to occur in the
root selection set of a GraphQL mutation operation (i.e. on the fields of the
mutation operation root type), similarly Gra*fast* only expects side effects
here and side effects in other locations in the plan may have unexpected
repercussions.

:::

`sideEffect` does not perform batching; it is only intended for performing
mutations, and mutations rarely batch.

:::tip

Almost any step can be made to be treated as having side effects by setting
`$step.hasSideEffects = true`, so if you require batching in your mutations
consider using an alternative step, such as
[`loadOne()`](/grafast/step-library/standard-steps/loadOne) and explicitly
marking it as having side effects:

```ts
const $random = loadOne(list([$min, $max]), (tuples) =>
  tuples.map(([min, max]) => min + Math.floor(Math.random() * (max - min + 1))),
);
$random.hasSideEffects = true;

return $random;
```

:::

## Single dependency version

```ts
function sideEffect<T, R>(
  $input: ExecutableStep<T>,
  callback: (input: T) => R | Promise<R>,
): ExecutableStep<R>;
```

### Example

```ts
const $logout = context().get("logout");
sideEffect($logout, (logout) => logout());
```

## Dependency-free version

If your callback doesn't need any input then you can pass `null` or `undefined`
instead of a step.

```ts
function sideEffect<R>(
  $input: null | undefined,
  callback: () => R | Promise<R>,
): ExecutableStep<R>;
```

### Example

```ts
sideEffect(null, () => console.log(new Date().toISOString()));
```

## Multiple dependencies version

If you need to pass multiple steps, you can pass a list:

```ts
sideEffect(
  // Tuple of dependencies
  [$login, $username, $password],
  // becomes a tuple in callback:
  ([login, username, password]) => login(username, password),
);
```

or an object:

```ts
sideEffect(
  // Object of dependencies
  { login: $login, username: $username, password: $password },
  // becomes an object in callback:
  ({ login, username, password }) => login(username, password),
);
```
