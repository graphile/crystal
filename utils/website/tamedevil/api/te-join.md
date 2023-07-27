---
sidebar_position: 5
title: "te.join()"
---

# `te.join(arrayOfFragments, delimiter)`

Joins an array of `te` values using the delimiter (a plain string); e.g.

```js
const keysAndValues = ["a", "b", "c", "d"].map(
  (n, i) => te`${te.safeKeyOrThrow(n)}: ${te.literal(i)}`,
);
const obj = te.run`return { ${te.join(keysAndValues, ", ")} }`;

assert.deepEqual(obj, { a: 0, b: 1, c: 2, d: 3 });
```
