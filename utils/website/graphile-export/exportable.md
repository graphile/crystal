---
sidebar_position: 3
title: Exportable/importable
---

As explained in [how it works](./how-it-works.md), your GraphQL schema must be
made in such a way that it can work with Graphile Export. This applies both to
the parts of the schema you write yourself, and the parts you may import from
external libraries.

Generally speaking there are 2 methods of achieving this, used in unison:

1. All non-pure functions and their non-trivial scope dependencies must be made
   exportable by wrapping in an `EXPORTABLE()` call, or be made importable via
   the special `$$export` property
2. If a dependency cannot be made exportable/importable then instead of
   depending on it via the JavaScript scope, it should be passed at runtime via
   the GraphQL `context` and referenced from there (the third argument to a
   resolver, or via the
   [context()](https://grafast.org/grafast/step-library/standard-steps/context)
   step in Gra*fast*)

:::info Pure functions

A pure function is a function that, given the same inputs, always produces the
same output and has no side effects. This means it doesn't modify any external
state or depend on variables outside its local scope. Pure functions are
deterministic and isolated from their surrounding context, making them ideal
for exportable functions as they don’t rely on external dependencies.

:::

## Making a value EXPORTABLE

You can import `EXPORTABLE` from `graphile-export/helpers` to avoid loading
unnecessary code into memory:

```ts
import { EXPORTABLE } from "graphile-export/helpers";
```

`EXPORTABLE(factory, deps)` is called with two arguments: a factory function
that accepts a list of the target functions scope dependencies and returns the
target function, and a list of the values for those dependencies. By convention
we maintain the names of the dependencies (i.e. we explicitly shadow the
variables) so that adding (or removing) EXPORTABLE causes minimal code changes.

### Simple EXPORTABLE example

For example, this simple `getExportTime()` function has one external variable,
`EXPORT_TIME`:

```ts
// A dependency provided via the JS scope
const EXPORT_TIME = Date.now();

export function getExportTime() {
  return EXPORT_TIME;
}
```

To make this function exportable we return it from the factory function that we
pass to `EXPORTABLE` along with the value for the dependency:

```ts
const EXPORT_TIME = Date.now();
export const getExportTime = EXPORTABLE(
  // A factory function called with the dependency values
  (EXPORT_TIME) =>
    function getExportTime() {
      return EXPORT_TIME;
    },
  // The values of the dependencies:
  [EXPORT_TIME],
);
```

:::tip Use eslint-plugin-graphile-export to autofix the dependencies list

Just wrapping your function in `EXPORTABLE(() => ...)` is a good first step,
then you can use `eslint-plugin-graphile-export` to assert that all of the
dependencies have been correctly passed (and it can even auto-fix it for you!)

:::

:::info EXPORTABLE factory functions are pure

The critical thing to note here is that although the function `getExportTime()`
is not "pure" (it references values other than its arguments), the factory
function we pass to `EXPORTABLE` must always be pure.

:::

:::warning Values are evaluated at export time

Note that the `Date.now()` is evaluated once, when the schema is exported, and
is never evaluated again &mdash; so it will always return the time when the schema
was exported, not when the JavaScript process starts up. In fact, the function
that appears in the exported code will likely look more like:

```ts
function getExportTime() {
  return 1730722557867;
}
```

In this way, the exported schema can often be more optimal that the code used
to generate it.

:::

### GraphQL EXPORTABLE example

Imagine that you have a resolver such as the `User.friends` resolver shown here:

```ts title="schema/resolvers.ts"
import { db } from "../runtime/db";

const resolvers = {
  User: {
    async friends(user, args, context, resolveInfo) {
      // highlight-next-line
      return await db.friends.loadMany(user.id, context);
    },
  },
};
```

Note that this resolver has a dependency on `db` from a higher JavaScript
scope. To wrap this with `EXPORTABLE` we must rewrite this from a method into a
property:

```diff
-    async friends  (user, args, context, resolveInfo)    {
+    friends: async (user, args, context, resolveInfo) => {
       return await db.friends.loadMany(user.id, context);
     },
```

Then we insert `EXPORTABLE(() =>` before the arrow function, and `)` after it:

```diff
-    friends:                  async (user, args, context, resolveInfo) => {
+    friends: EXPORTABLE(() => async (user, args, context, resolveInfo) => {
       return await db.friends.loadMany(user.id, context);
-    } ,
+    }),
```

Now we must explicitly pass all of the dependencies (the values that are
implicitly from the JavaScript parent scope, rather than passed in via
arguments), for the reasons described in ["how it works"](./how-it-works.md).

The easiest way to do this is to use the autofix included with the
`eslint-plugin-graphile-export` ESLint plugin; but we can also do it manually.
If a function is pure then it has no dependencies, but though this function
provides the `user` and `context` variables via the function arguments, the
`db` variable comes from a higher JavaScript scope, so we must explicitly pass
it:

```diff
-    friends: EXPORTABLE((  ) => async (user, args, context, resolveInfo) => {
+    friends: EXPORTABLE((db) => async (user, args, context, resolveInfo) => {
       return await db.friends.loadMany(user.id, context);
-    }      ),
+    }, [db]),
```

## Making a value importable with `$$export`

In the example above, `db` itself needs to be "exportable". We could do this in
the same way, but we'd need to do this all the way down and typically we need
to break the pattern somewhere unless we only depend on "simple" values.

The `$$export` special property can be added to a JavaScript
object/function/array/instance to tell Graphile Export that rather than trying
to write out the code for the entity itself, it should instead just import that
value from the given location. The `$$export` property on the entity should be
set to an object with two keys: `moduleName` which outlines the source of the
`import` statement (this is typically an `npm` module name, though it can also
be a path to a local file relative to where the exported code will be located),
and `exportName` which details which value should be imported (use `default` for
the default export).

### $$export example

For the example above, we might do this in the `runtime/db.ts` file like this:

```ts title="runtime/db.ts"
export const db = new DatabaseConnection();

// highlight-start
// Detail from where this value can be imported so that our exported schema
// can import it at runtime.
db.$$export = { moduleName: "./runtime/db", exportName: "db" };
// highlight-end
```

When we export the schema, we should then see something like:

```js
import { GraphQLObjectType } from "graphql";
// highlight-next-line
import { db } from "./runtime/db";

/* ... */

const User = new GraphQLObjectType({
  name: "User",
  /* ... */
  fields: {
    friends: {
      /* ... */
      async resolve(user, args, context, resolveInfo) {
        // highlight-next-line
        return await db.friends.loadMany(user.id, context);
      },
    },
  },
});
```

## Making resolvers pure via context

An alternative to wrapping everything in `EXPORTABLE` is to ensure that your
functions are pure. For resolvers, this can be achieved by never relying on
the JavaScript scope for values but instead importing them from the GraphQL
context. Our example above could instead have been:

```ts title="schema/resolvers.ts"
const resolvers = {
  User: {
    async friends(user, args, context, resolveInfo) {
      // highlight-start
      // Extract the dependency from the GraphQL context
      const { db } = context;
      // highlight-end
      return await db.friends.loadMany(user.id, context);
    },
  },
};
```

Note that this version of the `User.friends` resolver is a pure function, and
thus is already exportable without requiring an `EXPORTABLE()` wrapper.

How to pass values to the GraphQL context at runtime will differ depending on
what server framework you are using. For Grafast it might look something like:

```ts title="graphile.config.ts"
import type {} from "grafast";
// highlight-next-line
import { db } from "./runtime/db";

export const preset: GraphileConfig.Preset = {
  grafast: {
    // highlight-next-line
    context: (ctx) => ({ db }),
  },
};
```

## Troubleshooting

### `undefined variable EXPORTABLE`

Our ESLint plugin isn't smart enough to actually `import` the `EXPORTABLE`
helper, so after running the autofix you might end up with "undefined variable
`EXPORTABLE`" errors. You can either
`import { EXPORTABLE } from "graphile-export/helpers"`, or you can copy this
definition into your code:

```ts
export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
  nameHint?: string,
): T {
  const fn: T = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}
```

(Or, if you're using plain JavaScript:

```js
export function EXPORTABLE(factory, args, nameHint) {
  const fn = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}
```

)

### Cannot find module 'graphile-export/helpers'

If TypeScript gives you the error
`Cannot find module 'graphile-export/helpers' or its corresponding type declarations.`
then it's likely you're living in the past! This error happens because your
`tsconfig.json` is configured as if you were living in Node.js v14 (or before)
times!

The easiest solution is to use a really simple TSConfig.json such as the
`@tsconfig/node20` default which already configures TypeScript to support this:

```json title="tsconfig.json"
{
  "extends": "@tsconfig/node20"
}
```

Alternatively, explicitly change the `moduleResolution` setting to `Node16` or `NodeNext`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "Node16"
  }
}
```

---

Wrapping `EXPORTABLE(() => ...)` around our functions isn't too hard, but scanning through them to spot all the external dependencies can be time consuming and error prone. Let's find out how we can [use the Graphile Export ESLint plugin to autofix our EXPORTABLEs](./eslint.md).
