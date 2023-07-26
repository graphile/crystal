---
sidebar_position: 12
title: "te.compile()"
---

# `te.compile(fragment)`

Builds the TE fragment into a string ready to be evaluated, but does not
evaluate it. Returns an object containing the `string` and any `refs`. Useful
for debugging, or tests.

```js
const fragment = te`return ${te.ref(1)} + ${te.ref(2)}`;
const result = te.compile(fragment);

assert.deepEqual(result, {
  string: `return _$$_ref_1 + _$$_ref_2`,
  refs: { _$$_ref_1: 1, _$$_ref_2: 2 },
});
```
