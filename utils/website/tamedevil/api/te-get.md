---
sidebar_position: 8
title: "te.get()"
---

# `te.get(key)`

Returns an expression for accessing the property `key` (which could be a string,
symbol or number) of the preceding expression; will return code like `.foo` or
`["foo"]` as appropriate.

# `te.optionalGet(key)`

As with `te.get` except using optional chaining - the expression will be `?.foo`
or `?.["foo"]` as appropriate.
