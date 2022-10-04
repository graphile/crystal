# filter

Filters a list plan to only include entries for which the `filterCallback` plan
results in a truthy value.

Usage:

```ts
const $filteredList = filter($oldList, ($listItem) =>
  lambda($listItem, (value) => value > 42, true),
);
```
