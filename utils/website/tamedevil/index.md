---
sidebar_position: 1
title: tamedevil
---

# tamedevil

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

## Installation

```
yarn add tamedevil
```

or

```
npm install --save tamedevil
```
