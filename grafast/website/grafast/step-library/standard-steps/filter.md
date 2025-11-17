# filter

Returns a step representing a new list with only the entries for which the
(plan-time) `filterCallback` plan yields a truthy value.

Usage:

```ts
// Only the non-null items
const $nonNullItems = filter($list, ($item) => condition("exists", $item));
// Only the  items larger than 42
const gt42 = (value) => value > 42;
const $gt42Items = filter($list, ($item) => lambda($item, gt24, true));
```
