# last

Yields the last entry in the array yielded by the given step.

Pass `false` as the second parameter to handle iterables/async iterables in
addition to simple arrays (has greater overhead).

Usage:

```ts
const $lastItem = last($array);

// If the argument is an iterable, pass `false` to opt out of the array
// optimizations
const $lastItem = last($iterable, false);
```
