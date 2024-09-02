---
sidebar_position: 4
title: ESLint Plugin
---

# Using our ESLint plugin

Tracking all these dependencies yourself can to be a royal pain in the
aggragate, so we've written a plugin `eslint-plugin-graphile-export` to do away
with a lot of the pain.

To install:

```
yarn add eslint-plugin-graphile-export@beta
```

To set up, add `"graphile-export"` to your ESLint configuration's `plugins`
list, and `"plugin:graphile-export/recommended"` to the `extends` list:

```js
// .eslintrc.js
module.exports = {
  //...
  plugins: [
    //...
    "graphile-export",
    //...
  ],
  extends: [
    //...
    "plugin:graphile-export/recommended",
    //...
  ],
  //...
};
```

To use it, simply add `EXPORTABLE(() =>` before the value exporession to be
exported, and `)` after and then run `eslint --fix` against the file. It will
automatically convert:

```ts
const add = EXPORTABLE(
  () =>
    function add(b) {
      return a + b;
    },
);
```

to:

```ts
const add = EXPORTABLE(
  (
    // The dependencies:
    a,
  ) =>
    function add(b) {
      return a + b;
    },
  [
    // The dependency values
    a,
  ],
);
```

You don't need to do this yourself everywhere, the plugin will look for common
patterns and apply the `EXPORTABLE` itself as best it can. Do carefully review
the changes it has made.

Note: no accommodation for formatting has been made, it is assumed that you are
using `prettier` or similar code formatter and thus there's no need for us to
format the code.
