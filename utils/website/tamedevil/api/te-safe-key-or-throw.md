---
sidebar_position: 7
title: "te.safeKeyOrThrow()"
---

# `te.safeKeyOrThrow(ident, forceQuotes = false)`

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
`const obj = { ${te.safeKeyOrThrow(untrustedKey)}: value }` you instead use
`const obj = Object.create(null);` and then set the properties on the resulting
object via `${obj}[${te.lit(untrustedKey)}] = value;` - this prevents attacks
such as **prototype polution** since properties like `__proto__` are not special
on null-prototype objects, whereas they can cause havok in regular `{}` objects.
