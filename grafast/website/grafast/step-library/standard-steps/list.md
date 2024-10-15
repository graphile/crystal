# list

Takes a list of plans and turns it into a single plan that represents the list
of their values.

Usage:

```ts
const $abTuple = list([$a, $b]);
```

A ListStep has the following methods:

- `.at(index)` - gets the value at `index` (`abTuple.at(0)` returns `$a`).
- `.first()` - returns the first value in the list (`abTuple.first` returns `$a`).
- `.last()` - returns the last value in the list (`abTuple.last()` returns `$b`).
