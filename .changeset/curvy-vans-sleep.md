---
"graphile-config": patch
"postgraphile": patch
---

Fix plugin ordering bug that ignored before/after when there was no provider;
this now means PgSmartTagsPlugin is correctly loaded before
PgFakeConstraintPlugin, fixing the `postgraphile.tags.json5` file.
