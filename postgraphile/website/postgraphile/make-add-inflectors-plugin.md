---
layout: page
path: /postgraphile/make-add-inflectors-plugin/
title: Adding and replacing inflectors
---

Inflection relates to naming things; please see the [inflection
article](./inflection/) for more information on inflection in PostGraphile.

In V4 of PostGraphile we had `makeAddInflectorsPlugin`, but in V5 this is no
longer needed since inflection is now a first class feature of the plugin
system. Writing a plugin to add or replace inflectors is relatively
straightforward:

## Replacing an inflector

Replacing an inflector is slightly easier than adding a new one because there's
no need to define the TypeScript types (you just use the existing types); so
we'll start there.

Replacement inflectors are added via a plugin, using the
`inflection.replace.<inflectorName>` property, which should be set to a
function. This function accepts three or more parameters:

1. The previous version of the inflector, for delegation, or `null` if there wasn't previously an inflector with this name
2. The resolved `graphile-config` preset that the user is using
3. All remaining parameters are the inflector's inputs, from which a name should be derived

### Example 1

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

```ts
const text = inflection.builtin("Query");
```

:::

### Example 2

If you want `*Patch` types to instead be called `*ChangeSet` you could make a
plugin such as this one:

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
      patchType(previous, preset, typeName) {
        return this.upperCamelCase(`${typeName}-change-set`);
      },
    },
  },
};
```

## Adding a new inflector

Adding a new inflector is very much like adding a replacement inflector, with
the following differences:

1. No `previous` inflector existed, so the first argument is omitted
2. The types won't already exist, so you must declare them yourself, via the `global.GraphileBuild.Inflection` interface

In JS, adding a new inflector is straightforward:

```js
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
