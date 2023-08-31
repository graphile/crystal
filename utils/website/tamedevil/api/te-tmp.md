---
sidebar_position: 10
title: "te.tmp()"
---

# `te.te.tmp(obj, callback)`

(**ADVANCED**)

If `obj` is potentially expensive code and you need to reference it multiple
times (e.g. `` te`(${obj}.foo === 3 ? ${obj}.bar : ${obj}.baz)` ``) then you can
use `tmp` to create a temporary variable that stores reference to it and return
the result of calling `callback` passing this temporary reference. E.g.
``te.tmp(obj, tmp => te`(${tmp}.foo === 3 ? ${tmp}.bar : ${tmp}.baz)`)`` means
that the potentially expensive expression in the original `obj` variable only
need to be evaluated once, not 3 times.
