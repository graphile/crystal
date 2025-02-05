---
title: Settings
---

The following settings are supported:

- `pgConfig`\*: either the PostgreSQL connection string
  ('postgres://user:password@host/dbname') or a pgClient with which to
  introspect the database
- `pgSchemas`\*: an array of schema names to introspect, e.g. `['public']`
- `pgInflection`: the inflection object to use for naming
  fields/types/arguments/values. See:
  [graphile-build-pg/src/inflections.js](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build-pg/src/inflections.ts)
- `pgExtendedTypes`: set `true` (default) to use JSON and other advanced types,
  set `false` to use strings instead
- `pgJwtTypeIdentifier`: the fully qualified name of a compound type which, if
  seen, will be converted to a signed JWT token and returned as a string
  instead.
- `pgJwtSecret`: the secret with which to sign the above token
- `pgDisableDefaultMutations`: set to `true` if you don't want to use our
  default [CRUD mutations](https://postgraphile.org/postgraphile/current/crud-mutations)

These are mostly taken from the
[PostGraphile API `options`](https://postgraphile.org/postgraphile/current/usage-library#api-postgraphilepgconfig-schemaname-options),
options for custom plugins can be supplied through `graphileBuildOptions`. For
the complete list of options see
[the source of `getPostGraphileBuilder`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/postgraphile-core/src/index.ts#L365-L405).

\* Required
