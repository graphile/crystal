# list

Takes a list of plans and turns it into a single plan that represents the list
of their values.

Usage:

```ts
const $abcTuple = list([$a, $b, $c]);
```

A ListStep has the following methods:

- `.at(index)` - gets the value at `index` (`$abcTuple.at(1)` returns `$b`).
- `.first()` - returns the first value in the list (`$abcTuple.first()` returns `$a`).
- `.last()` - returns the last value in the list (`$abcTuple.last()` returns `$c`).
