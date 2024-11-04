---
sidebar_position: 2
title: How it works
---

# How Graphile Export works

The system works by converting values in memory into source code strings. One of
the key things that's challenging to export is functions (and function-derived
things such as classes). In JavaScript you can see the source code of a function
by calling `.toString()` on it:

```js
> (function add(a, b) { return a + b }).toString()
'function add(a, b) { return a + b }'
```

However this quickly falls down if you are using values from a parent closure
(aka a "higher scope"):

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
If we were to define and execute this function in a new clean JS environment
we'd get an error:

```js
> function add(b) { return a + b }
undefined
> add(3)
Uncaught ReferenceError: a is not defined
    at add (REPL1:1:19)
```

Graphile Export solves this by having you define your functions via a pure
factory function that accepts an explicit list of dependencies:

```js
> const { EXPORTABLE } = require("graphile-export")
undefined
> const a = 7;
undefined
> const add = EXPORTABLE((a) => function add(b) { return a + b; }, [a]);
undefined
```

_This may feel a little bit familiar to people who are used to working with
React hooks._

When you use this `EXPORTABLE` wrapper, the `add` function is augmented with
the hidden properties `$exporter$factory` and `$exporter$args` that represent
the first and second arguments to the `EXPORTABLE(factory, args, nameHint)`
function respectively.

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

And since we can see it, we can export it:

```js
const a = 7;
function add(b) {
  return a + b;
}
```

Of course, if the dependency `a` were a complex value (e.g. another function,
or a class instance), we'd also need to make that either exportable or
importable, so lets find out more about [making values exportable or importable](./exportable.md).
