---
"@dataplan/pg": patch
"grafast": patch
"graphile-build": patch
"graphile-build-pg": patch
"postgraphile": patch
---

🚨 Breaking changes around types and postgres configuration:

- `GraphileBuild.GraphileResolverContext` renamed to `Grafast.Context`
- `GraphileConfig.GraphQLRequestContext` renamed to `Grafast.RequestContext`
- `Grafast.PgDatabaseAdaptorOptions` renaed to
  `GraphileConfig.PgDatabaseAdaptorOptions`
- `@dataplan/pg/adaptors/node-postgres` is now `@dataplan/pg/adaptors/pg` due to
  the bizarre naming of PostgreSQL clients on npm - we've decided to use the
  module name as the unique identifier
- `makePgConfigs`:
  - is now `makePgConfig` (singular) - so you'll need to wrap it in an array
    where you use it
  - no longer exported by `@dataplan/pg` (because it depended on `pg`) - instead
    each adaptor exposes this helper - so import from
    `@dataplan/pg/adaptors/node-postgres`
  - accepts an object parameter containing
    `{connectionString, schemas, superuserConnectionString}`, rather than
    multiple string parameters
- `postgraphile` CLI will now try and respect the adaptor stated in your preset
  when overriding connection arguments
- Removed `Grafast.RequestContext.httpRequest` and instead use
  `Grafast.RequestContext.node.req/res`; all server adaptors should implement
  this if appropriate
