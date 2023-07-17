---
"grafast": patch
---

`constant(foo)` no longer adds the value of `foo` to the plan diagram unless you
pass `true` as the second option (`constant(foo, true)`) or `foo` is something
very basic like `null`/`undefined`/`true`/`false`. This is to protect your
secrets.
