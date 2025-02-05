---
title: "makeAddInflectorsPlugin"
---

# No makeAddInflectorsPlugin

`makeAddInflectorsPlugin` no longer exists; the new plugin system makes it a
little easier to write it yourself so the abstraction is no longer required.

## Replacing an inflector

Set `inflection.replace.inflectorName` in a plugin to a new inflector function;
the function will be passed the previous inflector function as the first
argument (`null` if there wasn't one), the resolved `GraphileConfig` preset as the
second argument, and any data passed to it as the remaining arguments.

This following plugin replaces the `builtin` inflector with one that returns
`RootQuery` instead of `Query` for the root query type:

```ts
// Import types for TypeScript, no need in JS
import "graphile-config";
import "graphile-build";
import "graphile-build-pg";

export const ReplaceInflectorPlugin: GraphileConfig.Plugin = {
  // Unique name for your plugin:
  name: "ReplaceInflectorPlugin",
  version: "0.0.0",

  inflection: {
    replace: {
      builtin(
        // The previous version of this inflector, the one you're replacing
        previous,

        // The resolved configuration
        preset,

        // Everything from the 3rd paramater onward are the arguments to this inflector
        text,
      ) {
        if (name === "Query") return "RootQuery";
        return previous(text);
      },
    },
  },
};
```

:::info

The first two arguments to your replace inflector definition are supplied by the
Graphile Build system and hidden from calling code, so only arguments from the
third onward are supplied by the calling code. For example, a replacement for
the `builtin` inflector could be defined as above, but calling code would only
supply the third argument:

```js
const text = inflection.builtin("Query");
```

:::

## Adding a new inflector

New inflectors accept the current preset as the first argument and any number of
additional arguments after that.

In JS, adding a new inflector is straightforward:

```js
export const MyNewInflectorPlugin: GraphileConfig.Plugin = {
  name: "MyNewInflectorPlugin",
  version: "0.0.0",
  inflection: {
    add: {
      myNewInflector(preset, columnName) {
        return columnName + "Something";
      },
    },
  },
};
```

In TypeScript, it's somewhat more verbose as we use [declaration merging][] to
make other plugins aware of the new inflector:

```ts
// Import types for TypeScript, no need in JS
import "graphile-config";
import "graphile-build";
import "graphile-build-pg";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      /**
       * Add documentation for your inflector here.
       */
      enhanced(this: Inflection, columnName: string): string;
    }
  }
}

export const MyNewInflectorPlugin: GraphileConfig.Plugin = {
  name: "MyNewInflectorPlugin",
  version: "0.0.0",

  inflection: {
    add: {
      enhanced(preset, columnName) {
        return columnName + "Enhanced";
      },
    },
  },
};
```

:::info

The first argument to your add inflector definition is supplied by the Graphile
Build system and hidden from calling code, so only arguments from the second
onward are supplied by the calling code. For example, the `enhanced` inflector
could be defined as above, but calling code would only supply the second
argument:

```js
const text = inflection.enhanced("avatarUrl");
```

:::

[declaration merging]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
