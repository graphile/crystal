---
"@dataplan/pg": patch
"grafast": patch
"postgraphile": patch
---

Fixes a planning bug where adding a non-unary dependency A to a unary step B
correctly converts B to be non-unary... but didn't _cascade_ that change to
unary steps that depend on B. The result was runtime (rather than plantime)
exceptions:
`GrafastInternalError<58bc38e2-8722-4c19-ba38-fd01a020654b>: unary step SomeStep[17] cannot be made dependent on non-unary step SomeOtherStep[29]!`
This is now resolved by cascading the change.
