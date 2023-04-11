---
"@graphile/simplify-inflection": patch
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"postgraphile": patch
"@dataplan/pg": patch
"graphile": patch
---

🚨 **RENAME ALL THE THINGS**

The term 'source' was overloaded, and 'configs' was too vague, and
'databaseName' was misleading, and 'source' behaviours actually applied to
resources, and more. So, we've renamed lots of things as part of the API
stabilization work. You're probably only affected by the first 2 bullet points.

- `pgConfigs` -> `pgServices` (also applies to related `pgConfig` terms such as
  `makePgConfig` -> `makePgService`, `MakePgConfigOptions` ->
  `MakePgServiceOptions`, etc) - see your `graphile.config.ts` or equivalent
  file
- All `*:source:*` behaviors are now `*:resource:*` behaviors (use regexp
  `/:source\b|\bsource:[a-z$]/` to find the places that need updating)
- `PgDatabaseConfiguration` -> `PgServiceConfiguration`
- `databaseName` -> `serviceName` (because it's not the name of the database,
  it's the name of the `pgServices` (which was `pgConfigs`) entry)
- `PgResourceConfig::source` -> `PgResourceConfig.from` ('source' is overloaded,
  so use a more direct term)
- `PgResource::source` -> `PgResource.from`
- `PgSelectPlanJoin::source` -> `PgSelectPlanJoin.from`
- `helpers.pgIntrospection.getDatabase` -> `helpers.pgIntrospection.getService`
- `helpers.pgIntrospection.getExecutorForDatabase` ->
  `helpers.pgIntrospection.getExecutorForService`
