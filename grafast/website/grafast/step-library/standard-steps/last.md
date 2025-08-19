# last

Resolves to the last entry in the array returned by the given step.

Pass `false` as the second parameter to also handle iterables/async iterables.

Usage:

```ts
const $lastItem = last($array);

// If the argument is an iterable, pass `false` to opt out of the array
// optimizations
const $lastItem = last($iterable, false);
```
