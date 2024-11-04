---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix behavior inheritance especially around functions incorrectly inheriting from
their underlying codecs, bugs in unlogged/temp table behavior, and incorrect
skipping of generating table types. You may find after this change you have
fields appearing in your schema that were not present before, typically these
will represent database functions where you `@omit`'d the underlying table -
omitting the table should not prevent a function from accessing it. Further, fix
behavior of `@omit read` emulation to add `-connection -list -array -single`.
