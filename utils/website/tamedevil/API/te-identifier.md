---
sidebar_position: 6
title: "te.identifier()"
---

# `te.identifier(name)`

Takes `name` (string) and returns a `TE` node for it if it could be a reasonable
name for a variable. If it doesn't seem a reasonable name then it will instead
throw an error, so be warned! This means that it will throw an error if any JS
reserved words are used, or if the name is potentially confusing (e.g. `async`).
For a full list of the _current_ reserved words, see `src/reservedWords.ts`, but
not that these words may change in a minor release.

This is not intended to be used with untrusted user data, it's just a
convenience method to use for example if you want to map the (string) keys of an
object into variable name TE nodes without using `te.dangerouslyIncludeRawCode`.
Normally you'd just use `` te`myVarNameHere` `` to define a variable name (as
just regular code).
