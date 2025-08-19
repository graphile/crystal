# first

Resolves to the first entry in the array returned by the given step.

Pass `false` as the second parameter to also handle iterables/async iterables.

Usage:

```ts
const $firstItem = first($array);

// If the argument is an iterable, pass `false` to opt out of the array
// optimizations
const $firstItem = first($iterable, false);
```
