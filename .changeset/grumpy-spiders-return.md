---
"graphile-build": patch
"postgraphile": patch
---

When replacing inflectors via `plugin.inflection.replace.<inflector_name>` the
first argument is the previous inflector (or null). Previously this was typed
including the `this: Inflection` argument which meant to appease TypeScript you
needed to do `previous.call(this, arg1, arg2)`, but this was never necessary in
JS. This is now fixed, and you can now issue `previous(arg1, arg2)` from
TypeScript without error.
