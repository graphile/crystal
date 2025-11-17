# first

Yields the first entry in the array the given step yields.

Pass `false` as the second parameter to also handle iterables/async iterables.

Usage:

```ts
const $firstItem = first($array);

// If the argument is an iterable, pass `false` to opt out of the array
// optimizations
const $firstItem = first($iterable, false);
```
