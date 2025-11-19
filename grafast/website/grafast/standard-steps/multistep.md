# multistep

```ts
export type Multistep =
  | Step
  | readonly [...(readonly Step[])]
  | Record<string, Step>
  | null
  | undefined;
```

To improve developer ergonomics, some step functions accept as input a "Multistep"
parameter that can take one of many forms:

- a step (`Step`)
- a list (tuple) of steps (`Step[]`)
- an object of steps (`Record<string, Step>`)
- `null` or `undefined`
- a thunk thereof (`() => Multistep`)

You can see this in Gra*fast*'s native APIs that accept "step or multistep"
arguments, such as `loadOne`, `loadMany`, `lambda`, and `sideEffect`.

Under the hood, these step functions will use the `multistep(specOrThunk)`
function to convert this loose collection of steps into a single step with the
expected shape. Tuples become a [`list`](./list.md), objects become an
[`object`](./object.md), isolated steps are returned untouched, and
`null`/`undefined` become a [`constant`](./constant.md) step. Methods calling
multistep may choose to pass either `true` or a string identifier as the second
argument, doing so (as is done by `loadOne` and `loadMany` automatically)
enables the same output tuple/object to be reused when the same input values are
seen again, helping with logic that makes use of strict equality checks.

## Usage

<!-- See: https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgZRgUzAGjiArgGxmAGd0w4BfOAMyghDgCIBzKAQ2rdMYCgYBPMGjgBBOAF5EbAFwA7XCABGaKBT6DhAIQmJF0uKSjBZzNTwD05lPWGkMxOPwi4cbfnADubWfBgQ4AMb0isZoPEGypHAAJDIoZAA8IgB8OmwAFACUANzhEJHw0XrxGAmaqZKKWbkWVgBKaDC4UJFwAAaxbXAAbiqKbEQgeQUxQUqhACYAjDp4hCRk6bE5tXBrcAB6APw8qw1NLQ5sBmRwUBjnxGg+xsxwMAAWwk1g+GERUdFjIbJoEwBMswIRDsYHSAG1YtgigBdOBcQL5UgrSzrTY7PaNZqyeEnDBnC5oK43Ez3J5wCCKABWaACMGGn2+kwAzED5qD0kg4lC4MUipQUVZ1ttdqj9tijoiCt56R9CkzfhMACxskGLeT4fCCtEi1YAFQeuFkAGsjvhiP4PNBjQz5cFJgBWVULDDpLISVKc+H6Hl8xQC7XCjFAA -->

```ts
// Some example steps to combine
const $a: Step<A> = a();
const $b: Step<B> = b();

// Returns `$a` verbatim
const $combined1 = multistep($a);
//    ^? const $combined1: Step<A>

// Returns a step representing the tuple
const $combined2 = multistep([$a, $b] as const);
//    ^? const $combined2: Step<readonly [A, B]>

// Return a step representing the object
const $combined3 = multistep({ a: $a, b: $b });
//    ^? const $combined3: Step<{ readonly a: A; readonly b: B }>

// Returns a constant
const $combined4 = multistep(null);
//    ^? const $combined4: Step<null>

// Thunks also work
const $combined5 = multistep(() => ({ a: $a, b: $b }));
//    ^? const $combined5: Step<{ readonly a: A; readonly b: B }>
```

:::tip[Improving types]

Declare tuple literals with `as const` so that TypeScript keeps the tuple
typing; otherwise they may be widened to arrays.

```ts
multistep([$a, $b] as const);
```

:::
