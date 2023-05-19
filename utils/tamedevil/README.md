# tamedevil

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

**Eval is evil, this module helps tame it!**

It's generally recommended that you don't use `eval` or `new Function` when
writing JavaScript/TypeScript code. There's many many reasons for this, here are
but a few:

- **code injection**: without sufficient caution, attackers could inject
  poisoned strings into your `eval`s and you might unwittingly start evaluating
  their code, which can lead to extremely serious security incidents
- **garbage collection**: `eval` (and, to a lesser extend, `new Function`) are
  hard for the JS engine to understand, which can result in values that should
  have been garbage collected instead being retained just in case
- **debugging**: errors thrown from or issues inside of evaluated code are hard
  to inspect, they don't have line numbers that match up with your source code

However, `eval` and `new Function` can be powerful tools for building performant
code - if you have a list of operations to perform, it may be much more
performant to build a dynamic function to evaluate those operations at native JS
speed rather than to build your own interpretter.

`tamedevil` makes it much safer to build this kind of dynamic function, by
ensuring that every string and substring that is to be evaluated is either code
that you, the author, has written (it's something "you know"), or is some text
that has been suitably escaped - this helps to address the **code injection**
concern. We accomplish this with the power of tagged template literals and
symbols.

We also attempt to address the **garbage collection** concern by ensuring that
there is no ephemeral data in the closure in which the code is evaluated, so
nothing to be garbage collected. Note that we **do not** capture the closure in
which you define the string - all parameters must be passed explicitly (via the
helpers), which is one reason we use `new Function` rather than `eval` under the
hood.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://surge.io/"><img src="https://graphile.org/images/sponsors/surge.png" width="90" height="90" alt="Surge" /><br />Surge</a> *</td>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Installation

```
yarn add tamedevil
```

or

```
npm install --save tamedevil
```

## Importing

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

## API

### `` te`...` ``

Builds part of (or the whole of) a JS expression, safely interpreting the
embedded expressions. If a non `te` expression is passed in, e.g.:

<!-- skip-example -->

```js
te`return 2 + ${1}`; // WILL THROW AN ERROR
```

then an error will be thrown. This prevents code injection, as all values must
go through an allowed API.

### `te.ref(val, name?)` (alias: te.reference)

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

### `te.lit(val)` (alias: te.literal)

As `te.ref`, but in the case of simple primitive values (strings, numbers,
booleans, null, undefined) may write them directly to the code rather than
passing them by reference, which may make the resulting code easier to read.

Besides being useful for general purposes, this is the preferred way of safely
settings keys on a dynamic object, for example:

```js
// This is a perfectly reasonable key
const key1 = "one";

// Note this key would be unsafe to set on an object created via `{}`, but is
// fine for `Object.create(null)`
const key2 = "__proto__";

const obj = te.run`\
  const obj = Object.create(null);
  obj[${te.lit(key1)}] = 1;
  obj[${te.lit(key2)}] = { str: true };
  return obj;
`;

assert.equal(typeof obj, "object");
assert.equal(obj.one, 1);
assert.deepEqual(obj.__proto__, { str: true });
```

### `te.substring(str, stringType)`

If you're building a string and you want to inject untrusted content into it
without opening yourself to code injection attacks, this is the method for you.
Pass the string you'd like escaped as the first argument, and the second
argument should be `"`, `'` or `` ` `` depending on what type of string you're
embedding into. Example:

```js
// Some untrusted user input, could have anything in it
const untrusted = "'\"` \\'\\\"\\` ${process.exit(1)}";

// Safely insert the untrusted input into a string
const code = te.run`return "abc${te.substring(untrusted, '"')}123";`;

assert.strictEqual(code, "abc'\"` \\'\\\"\\` ${process.exit(1)}123");
```

### `te.join(arrayOfFragments, delimiter)`

Joins an array of `te` values using the delimiter (a plain string); e.g.

```js
const keysAndValues = ["a", "b", "c", "d"].map(
  (n, i) => te`${te.dangerousKey(n)}: ${te.literal(i)}`,
);
const obj = te.run`return { ${te.join(keysAndValues, ", ")} }`;

assert.deepEqual(obj, { a: 0, b: 1, c: 2, d: 3 });
```

### `te.identifier(name)`

Takes `name` (string) and returns a `TE` node for it if it could be a reasonable
name for a variable. If it doesn't seem a reasonable name then it will instead
throw an error, so be warned! This means that it will throw an error if any JS
reserved words are used, or if the name is potentially confusing (e.g. `async`).
For a full list of the _current_ reserved words, see
[reservedWords.ts](./src/reservedWords.ts), but not that these words may change
in a minor release.

This is not intended to be used with untrusted user data, it's just a
convenience method to use for example if you want to map the (string) keys of an
object into variable name TE nodes without using `te.dangerouslyIncludeRawCode`.
Normally you'd just use `` te`myVarNameHere` `` to define a variable name (as
just regular code).

### `te.dangerousKey(ident, forceQuotes = false)`

Takes `ident` and turns it into the representation of a safely escaped
JavaScript object key (to be used in an object definition). We do our best to
not put quote marks around the key unless necessary (or `forceQuotes` is set),
so that the output code is more pleasant to read.

We'll throw an error if you pass an `ident` that contains unexpected characters,
this is intended to be used with relatively straightforward strings
(`/[$@A-Za-z0-9_.-]+$/`). We also forbid common attack vectors such as
`__proto__`, `constructor`, `hasOwnProperty`, etc. (For the full list, evaluate
`Object.getOwnPropertyNames(Object.prototype)`.)

**IMPORTANT**: It's strongly recommended that instead of defining an object via
`const obj = { ${te.dangerousKey(untrustedKey)}: value }` you instead use
`const obj = Object.create(null);` and then set the properties on the resulting
object via `${obj}[${te.lit(untrustedKey)}] = value;` - this prevents attacks
such as **prototype polution** since properties like `__proto__` are not special
on null-prototype objects, whereas they can cause havok in regular `{}` objects.

### `te.get(key)`

Returns an expression for accessing the property `key` (which could be a string,
symbol or number) of the preceding expression; will return code like `.foo` or
`["foo"]` as appropriate.

### `te.optionalGet(key)`

As with `te.get` except using optional chaining - the expression will be `?.foo`
or `?.["foo"]` as appropriate.

### `te.set(key, hasNullPrototype?)`

As with `te.get`, except since it's for setting a key we'll perform checks to
ensure you're not writing to unsafe keys (such as `__proto__`) unless you
specify that `hasNullPrototype` is true (because any key can bet written safely
to `Object.create(null)`).

### `te.tempVar(symbol = Symbol())`

**EXPERIMENTAL**

Creates a temporary variable (or returns the existing temp var if the same
symbol is passed again) that can be used in expressions and statements.

### `te.tmp(obj, callback)`

(**ADVANCED**)

If `obj` is potentially expensive code and you need to reference it multiple
times (e.g. `` te`(${obj}.foo === 3 ? ${obj}.bar : ${obj}.baz)` ``) then you can
use `tmp` to create a temporary variable that stores reference to it and return
the result of calling `callback` passing this temporary reference. E.g.
`` te.tmp(obj, tmp => te`(${tmp}.foo === 3 ? ${tmp}.bar : ${tmp}.baz)`) `` means
that the potentially expensive expression in the original `obj` variable only
need to be evaluated once, not 3 times.

### `te.run(fragment)` (alias: eval)

Evaluates the TE fragment and returns the result.

```js
const fragment = te`return 1 + 2`;
const result = te.run(fragment);

assert.equal(result, 3);
```

### `te.compile(fragment)`

Builds the TE fragment into a string ready to be evaluated, but does not
evaluate it. Returns an object containing the `string` and any `refs`. Useful
for debugging, or tests.

```js
const fragment = te`return ${te.ref(1)} + ${te.ref(2)}`;
const result = te.compile(fragment);

assert.deepEqual(result, {
  string: `return _$$_ref_1 + _$$_ref_2`,
  refs: { _$$_ref_1: 1, _$$_ref_2: 2 },
});
```
