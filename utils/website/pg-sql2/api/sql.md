---
sidebar_position: 1
---

# ``sql `...` ``

Builds part of (or the whole of) an SQL query, safely interpreting the embedded expressions. If a non sql expression is passed in, e.g.:

```js
sql`select ${1}`;
```

then an error will be thrown. This prevents SQL injection, as all values must go through an allowed API.
