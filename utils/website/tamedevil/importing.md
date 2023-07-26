---
sidebar_position: 2
---

# Importing

We use the abbreviation `te` to refer to the tagged template literal function,
and all the helpers are available as properties on this function, so it's
typically the only thing you need to import.

For ESM, import `te`:

```js
import { te } from "tamedevil";
```

Or for CommonJS, `require` it:

```js
const { te } = require("tamedevil");
```

## Example

```js
// Here's a string we want to embed into the function:
const spec = "some string here";

// And here's a complex variable we want to use within the function's scope:
const source = new Source(/* ... */);

const toEval = te`\
  const source = ${te.ref(source)};
  return function plan($record) {
    const $records = source.find(${te.lit(spec)});
    return connection($records);
  }
`;

const plan = te.run(toEval);

assert.strictEqual(
  plan.toString(),
  `function plan($record) {
    const $records = source.find("some string here");
    return connection($records);
  }`,
);
```
