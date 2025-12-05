---
"graphile-build-pg": patch
"postgraphile": patch
---

Handle primary key columns called `Id`, `ID` and... I guess... `iD` when
renaming `id` -> `rowId` to make space for the `id: ID!` Relay column when using
the Amber preset without V4 preset.
