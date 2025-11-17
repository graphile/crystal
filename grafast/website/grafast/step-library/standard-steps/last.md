# last

Yields the last entry in the array the given step yields.

Pass `false` as the second parameter to also handle iterables/async iterables.

Usage:

```ts
const $lastItem = last($array);

// If the argument is an iterable, pass `false` to opt out of the array
// optimizations
const $lastItem = last($iterable, false);
```
