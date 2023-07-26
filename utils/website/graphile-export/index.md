---
sidebar_position: 1
---

# Graphile Export

Graphile Export enables you to export a GraphQL Schema (or other code) as executable JavaScript code. You must, however, write your code in a way that makes it exportable; we have ESLint plugins to make this less onerous.

## How it works

The system works by converting values in memory into source code strings. One of
the key things that's challenging to export is functions (and function-derived
things such as classes). In JavaScript you can see the source code of a function
by calling `.toString()` on it:

```js
> (function add(a, b) { return a + b }).toString()
'function add(a, b) { return a + b }'
```

However this quickly falls down if you are using values from a parent closure:

```js
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

```js
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

```js
> add(3)
10
> add.toString()
'function add(b) { return a + b; }'
```

But `graphile-export` can access these special properties when it writes the
code out, and now it can see the value of that "invisible" `a=7`:

```js
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
