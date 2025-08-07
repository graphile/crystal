# first

Resolves to the first entry in the array or iterable returned by the given step.

Pass `true` as the second parameter if you know the result will be an array (or
`null`/`undefined`) and the step will be more optimal, otherwise iterables and
async iterables will be handled automatically.

Usage:

```ts
const $firstItem = first($iterable);

// Iff `$array` represents `Maybe<Array<any>>`, pass `true` to optimize:
const $firstItem = first($array, true);
```
