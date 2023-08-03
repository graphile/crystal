# graphile-export

Graphile Export enables you to export a GraphQL Schema (or other code) as
executable JavaScript code. You must, however, write your code in a way that
makes it exportable; we have ESLint plugins to make this less onerous.

## How it works

The system works by converting values in memory into source code strings. One of
the key things that's challenging to export is functions (and function-derived
things such as classes). In JavaScript you can see the source code of a function
by calling `.toString()` on it:

```
> (function add(a, b) { return a + b }).toString()
'function add(a, b) { return a + b }'
```

However this quickly falls down if you are using values from a parent closure:

```
> const a = 7;
undefined
> function add(b) { return a + b };
undefined
> add(3)
10
> add.toString()
'function add(b) { return a + b }'
```

See how the function definition string `add.toString()` returns its definition,
but you cannot determine from that what the value of `a` is. This is a problem.

Graphile Export solves this by having you define your functions a bit like React
hooks - you must state the dependencies explicitly:

```
> const { EXPORTABLE } = require("graphile-export")
undefined
> const a = 7;
undefined
> const add = EXPORTABLE((a) => function add(b) { return a + b; }, [a]);
undefined
```

When you do so, the `add` function is augmented with the properties
`$exporter$factory` and `$exporter$args` that represent the first and second
arguments to the `EXPORTABLE(factory, args)` function respectively.

The function still works as before:

```
> add(3)
10
> add.toString()
'function add(b) { return a + b; }'
```

But `graphile-export` can access these special properties when it writes the
code out, and now it can see the value of that "invisible" `a=7`:

```
> add.$exporter$factory.toString()
'(a) => function add(b) { return a + b; }'
> add.$exporter$args
[ 7 ]
```

Thus everything that can have these kinds of hidden properties must be wrapped
in an `EXPORTABLE` call. Sometimes the inputs to the `EXPORTABLE` call
themselves also have to be wrapped in an `EXPORTABLE` call. You'll figure out
which things need wrapping by looking at the exported code and seeing where
references are broken.

## Using our ESLint plugin

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

## EXPORTABLE

Our ESLint plugin isn't smart enough to actually `import` the `EXPORTABLE`
helper, so after running the autofix you might end up with "undefined variable
`EXPORTABLE`" errors. You can either
`import { EXPORTABLE } from "graphile-export"`, or you can copy this definition
into your code:

```ts
export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
): T {
  const fn: T = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
    });
  }
  return fn;
}
```

(Or, if you're using plain JavaScript:

```js
export function EXPORTABLE(factory, args) {
  const fn = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
    });
  }
  return fn;
}
```

)

## Plans for the future

One issue with this is that it makes your code quite messy. We're hoping to come
up with a preprocessor or babel plugin or similar that should mean that your
original code doesn't need all this boilerplate. But for now, explicit and
functional is what we're going with!
