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

```js title=".eslintrc.js"
module.exports = {
  //...
  plugins: [
    //...
    // highlight-next-line
    "graphile-export",
    //...
  ],
  extends: [
    //...
    // highlight-next-line
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
  // highlight-next-line
  (a) =>
    function add(b) {
      return a + b;
    },
  // highlight-next-line
  [a],
);
```

You don't need to do this yourself everywhere, the plugin will look for common
patterns (property names such as `resolve`, `subscribe`, `plan`,
`subscribePlan`, `inputPlan`, `applyPlan` and so on within objects that look
like they are probably GraphQL related) and apply the `EXPORTABLE` itself as
best it can.

:::warning Autofix is based on heuristics

eslint-plugin-graphile-export will try to spot places that you've forgotten to
add `EXPORTABLE` and will add it for you; but this is done based on heuristics
and thus it can go wrong. You should carefully review your autofixed code to
ensure that the plugin hasn't made any mistakes adding `EXPORTABLE` to other
areas of your code. We recommend you only run this plugin against the parts of
your code for which the fixes would be relevant.

:::

:::note Autofixed code is unformatted

No accommodation for formatting has been made, it is assumed that you are using
`prettier` or similar code formatter and thus there's no need for us to format
the code.

:::

---

Will it always be this messy looking at exportable code? Lets take a look at
the [plans for the future](./the-future.md).
