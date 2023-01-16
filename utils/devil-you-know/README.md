# devil-you-know

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

**Eval is evil, but it's better the devil you know!**

It's generally recommended that you don't use `eval` or `new Function` when
writing JavaScript/TypeScript code. There's many many reasons for this, here are
but a few:

- **code injection**: without sufficient caution, attackers could inject
  poisoned strings into your `eval`s and you might unwittingly start evaluating
  their code
- **garbage collection**: `eval` (and, to a lesser extend, `new Function`) are
  hard for the JS engine to understand, which can result in values that should
  have been garbage collected instead being retained just in case
- **debugging**: errors thrown from or issues inside of evaluated code are hard
  to inspect, they don't have line numbers that match up with your source code

However, `eval` and `new Function` can be powerful tools for building performant
code - if you have a list of operations to perform, it may be much more
performant to build a dynamic function to evaluate those operations at native JS
speed rather than to build your own interpretter.

`devil-you-know` makes it much safer to build this kind of dynamic function, by
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
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
</tr><tr>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.fanatics.com/"><img src="https://graphile.org/images/sponsors/fanatics.png" width="90" height="90" alt="Fanatics" /><br />Fanatics</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
</tr><tr>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Installation

```
yarn add devil-you-know
```

or

```
npm install --save devil-you-know
```

## Importing

We use the abbreviation `dyk` (pronounced
[_deek_](https://www.collinsdictionary.com/dictionary/english/deek) - **not**
like the abbreviation for Richard, nor the name for a sea defence embankment) to
refer to the tagged template literal function, and all the helpers are available
as properties on this function, so it's typically the only thing you need to
import.

For ESM, import `dyk`:

<!-- skip-example -->

```js
import { dyk } from "devil-you-know";
```

Or for CommonJS, `require` it:

<!-- skip-example -->

```js
const { dyk } = require("devil-you-know");
```

## Example

```js
// Here's a string we want to embed into the function:
const spec = "some string here";

// And here's a complex variable we want to use within the function's scope:
const source = new Source(/* ... */);

const toEval = dyk`\
  const source = ${dyk.ref(source)};
  return function plan($record) {
    const $records = source.find(${dyk.lit(spec)});
    return connection($records);
  }
`;

const plan = dyk.run(toEval);

console.log(plan.toString());
/* Outputs:

function plan($record) {
  const $records = source.find("some string here");
  return connection($records);
}

*/
```

## API

### `` dyk`...` ``

Builds part of (or the whole of) a JS expression, safely interpreting the
embedded expressions. If a non `dyk` expression is passed in, e.g.:

<!-- skip-example -->

```js
dyk`return 2 + ${1}`;
```

then an error will be thrown. This prevents code injection, as all values must
go through an allowed API.

### `dyk.ref(val)` (alias: dyk.reference)

Tells `dyk` to pass the given value by reference into the scope of the function
via a closure, and returns an identifier that can be used to reference it. Note:
the identifier used will be randomized to avoid the risk of conflicts, so if you
are building code that will ultimately return a function, we recommend giving
the ref an alias outside of the function to make the function text easier to
debug, e.g.:

```js
const source = new Source(/* ... */);
const spec = "some string here";

const toEval = dyk`\
  const source = ${dyk.ref(source)};
  return function plan($record) {
    const $records = source.find(${dyk.lit(spec)});
    return connection($records);
  }
`;
```

### `dyk.lit(val)` (alias: dyk.literal)

As `dyk.ref`, but in the case of simple primitive values (strings, numbers,
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

const fragment = dyk`\
  const obj = Object.create(null);
  obj[${dyk.lit(key1)}] = 1;
  obj[${dyk.lit(key2)}] = {str: true};
  return obj;
`;
```

### `dyk.join(arrayOfFragments, delimiter)`

Joins an array of `dyk` values using the delimiter (a plain string); e.g.

```js
const keysAndValues = ["a", "b", "c", "d"].map(
  (n, i) => dyk`${dyk.dangerousKey(n)}: ${dyk.literal(i)}`,
);
const obj = dyk`{ ${dyk.join(keysAndValues, ", ")} }`;
// obj = { a: 0, b: 1, c: 2, d: 3 }
```

### `dyk.dangerousKey(ident, forceQuotes = false)`

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
`const obj = { ${dyk.dangerousKey(untrustedKey)}: value }` you instead use
`const obj = Object.create(null);` and then set the properties on the resulting
object via `${obj}[${dyk.lit(untrustedKey)}] = value;` - this prevents attacks
such as **prototype polution** since properties like `__proto__` are not special
on null-prototype objects, whereas they can cause havok in regular `{}` objects.

### `dyk.get(key)`

Returns an expression for accessing the property `key` (which could be a string,
symbol or number) of the preceding expression; will return code like `.foo` or
`["foo"]` as appropriate.

### `dyk.optionalGet(key)`

As with `dyk.get` except using optional chaining - the expression will be
`?.foo` or `?.["foo"]` as appropriate.

### `dyk.tempVar(symbol = Symbol())`

**EXPERIMENTAL**

Creates a temporary variable (or returns the existing temp var if the same
symbol is passed again) that can be used in expressions and statements.

### `dyk.tmp(obj, callback)`

(**ADVANCED**)

If `obj` is potentially expensive code and you need to reference it multiple
times (e.g. `` dyk`(${obj}.foo === 3 ? ${obj}.bar : ${obj}.baz)`  ``) then you
can use `tmp` to create a temporary variable that stores reference to it and
return the result of calling `callback` passing this temporary reference. E.g.
`` dyk.tmp(obj, tmp => dyk`(${tmp}.foo === 3 ? ${tmp}.bar : ${tmp}.baz)`) ``
means that the potentially expensive expression in the original `obj` variable
only need to be evaluated once, not 3 times.

### `dyk.run(fragment)` (alias: eval)

Evaluates the DYK fragment and returns the result.

```js
const fragment = dyk`return 1 + 2`;
const result = dyk.run(fragment);
// result = 3;
```

### `dyk.compile(fragment)`

Builds the DYK fragment into a string ready to be evaluated, but does not
evaluate it. Returns an object containing the `string` and any `refs`. Useful
for debugging, or tests.

```js
const fragment = dyk`return ${dyk.ref(1)} + ${dyk.ref(2)}`;
const result = dyk.compile(fragment);
// result = { string: `return _$_ref1 + _$_ref2`, refs: { _$_ref1: 1, _$_ref2: 2 } }
```
