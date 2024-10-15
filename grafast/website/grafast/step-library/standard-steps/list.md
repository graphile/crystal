# list

Takes a list of plans and turns it into a single plan that represents the list
of their values.

Usage:

```ts
const $abTuple = list([$a, $b]);
```

```ts
abTuple.at(0); // returns $a
abTuple.first(); // returns $a
abTuple.last(); // returns $b
```
