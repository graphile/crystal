---
sidebar_position: 3
title: "te.lit()"
---

# `te.lit(val)`

**(alias: te.literal)**

As `te.ref`, but in the case of simple primitive values (strings, numbers,
booleans, null, undefined) may write them directly to the code rather than
passing them by reference, which may make the resulting code easier to read.

Besides being useful for general purposes, this is the preferred way of safely
settings keys on a dynamic object, for example:

```js
// This is a perfectly reasonable key
const key1 = "one";

// Note this key would be unsafe to set on an object created via `{}`, but is
// fine for `Object.create(null)`
const key2 = "__proto__";

const obj = te.run`\
  const obj = Object.create(null);
  obj[${te.lit(key1)}] = 1;
  obj[${te.lit(key2)}] = { str: true };
  return obj;
`;

assert.equal(typeof obj, "object");
assert.equal(obj.one, 1);
assert.deepEqual(obj.__proto__, { str: true });
```
