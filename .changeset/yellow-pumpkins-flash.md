---
"graphile-build": patch
"graphile-build-pg": patch
"postgraphile": patch
---

Overhaul the behavior system (see
https://postgraphile.org/postgraphile/next/behavior).

- Adds `schema.defaultBehavior` configuration option to save having to write a
  plugin for such a simple task
- Changes a bunch of behavior strings:
  - `(query|singularRelation|manyRelation|queryField|typeField):(list|connection|single)`
    -> `$1:source:$2` (e.g. `query:list` -> `query:source:list`)
- Checks for more specific behaviors, e.g. `source:update` or
  `constraint:source:update` or `attribute:update` rather than just `update`
- Updates every change to `getBehavior` so that it follows the relevant chain
  (e.g. codec -> source -> relation for relations, similar for other types)
- More helpful error message when `-insert` prevents functions with input
  arguments working
- Throw an error if you try and use "create" scope (because we use
  insert/update/delete not create/update/delete)
