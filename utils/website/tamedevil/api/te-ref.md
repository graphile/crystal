---
sidebar_position: 2
title: "te.ref()"
---

# `te.ref(val, name?)`

**(alias: te.reference)**

Tells `te` to pass the given value by reference into the scope of the function
via a closure, and returns an identifier that can be used to reference it. Note:
the identifier used will be randomized to avoid the risk of conflicts, so if you
are building code that will ultimately return a function, we recommend giving
the ref an alias outside of the function to make the function text easier to
debug, e.g.:

```js
const source = new Source(/* ... */);
const spec = "some string here";

const plan = te.run`\
  const source = ${te.ref(source)};
  return function plan($record) {
    const $records = source.find(${te.lit(spec)});
    return connection($records);
  }
`;

assert.strictEqual(
  plan.toString(),
  `function plan($record) {
    const $records = source.find("some string here");
    return connection($records);
  }`,
);
```

If you want to force a particular identifier to be used, you can pass the
`name`, but then it's up to you to ensure that no conflicts take place:

```js
const source = new Source(/* ... */);
const spec = "some string here";

const plan = te.run`\
  return function plan($record) {
    const $records = ${te.ref(source, "source")}.find(${te.lit(spec)});
    return connection($records);
  }
`;

assert.strictEqual(
  plan.toString(),
  `function plan($record) {
    const $records = source.find("some string here");
    return connection($records);
  }`,
);
```
