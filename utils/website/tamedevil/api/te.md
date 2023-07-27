---
sidebar_position: 1
title: "te ..."
---

# `` te`...` ``

Builds part of (or the whole of) a JS expression, safely interpreting the
embedded expressions. If a non `te` expression is passed in, e.g.:

```js
te`return 2 + ${1}`; // WILL THROW AN ERROR
```

then an error will be thrown. This prevents code injection, as all values must
go through an allowed API.
