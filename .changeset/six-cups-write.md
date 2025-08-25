---
"postgraphile": patch
"grafast": patch
---

🚨 **Building connections overhauled** - `connection()` has been overhauled,
please re-read the docs on this and adjust your plans as necessary.

- If your custom steps have the `connectionClone` method, the first argument
  (`$connection`) has been removed because connection depends on your collection
  step (rather than the other way around as it was previously) - this should
  simplify implementation.
- Custom steps that are used with `connection()` are now just assumed to be
  simple lists unless they indicate otherwise using `paginationSupport` (see the
  `connection()` docs) - this means you can use any (list-returning) step with
  `connection()`! 🎉
- `PgPageInfoStep` is no more. Various other steps have been rearranged and had
  (mostly internal, or at least extremely rarely used) methods renamed, replaced
  or removed. (E.g. `PgSelectSingleStep` no longer has `.node()` or `.cursor()`
  methods since it is no longer implicitly an "edge step".)
- `@stream` has been optimized somewhat, no longer requiring multiple
  independent streams from the database as required previously (and as would be
  required by GraphQL.js under the same circumstances)
