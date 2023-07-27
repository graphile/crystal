---
sidebar_position: 11
title: "te.run()"
---

# `te.run(fragment)`

**(alias: eval)**

Evaluates the TE fragment and returns the result.

```js
const fragment = te`return 1 + 2`;
const result = te.run(fragment);

assert.equal(result, 3);
```
