# v8.0.0

## 8.0.0-alpha.4

### Patch Changes

- [#408](https://github.com/benjie/postgraphile-private/pull/408)
  [`01ad64d5d`](https://github.com/benjie/postgraphile-private/commit/01ad64d5d34be84b8fb5c096505db553406328e6)
  Thanks [@benjie](https://github.com/benjie)! - Renamed `getBaseName`,
  `baseNameMatches`, `getOppositeBaseName` and `getBaseNameFromKeys` inflectors
  to all begin with an underscore (`_`) - this is because these inflectors
  should only be used from other inflectors, since they may return non-string
  types (null/boolean/etc).

## 8.0.0-alpha.3

### Patch Changes

- [#338](https://github.com/benjie/postgraphile-private/pull/338)
  [`dcc3d0355`](https://github.com/benjie/postgraphile-private/commit/dcc3d03558d28506260dcfc79e1a797b60ec1773)
  Thanks [@benjie](https://github.com/benjie)! - `@interface mode:union`
  interfaces now also gain root fields.

## 8.0.0-alpha.2

### Patch Changes

- [`f61879689`](https://github.com/benjie/postgraphile-private/commit/f6187968901fc708e74b2b68e74a282465a8d07d)
  Thanks [@benjie](https://github.com/benjie)! - Fix baseNameMatches to resolve
  a regression in simplify-inflector V7 compatibility.

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

## 8.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

## 8.0.0-1.1

### Patch Changes

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`96b0bd14e`](https://github.com/benjie/postgraphile-private/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4)
  Thanks [@benjie](https://github.com/benjie)! - `PgSource` has been renamed to
  `PgResource`, `PgTypeCodec` to `PgCodec`, `PgEnumTypeCodec` to `PgEnumCodec`,
  `PgTypeColumn` to `PgCodecAttribute` (and similar for related
  types/interfaces). `source` has been replaced by `resource` in various of the
  APIs where it relates to a `PgResource`.

  `PgSourceBuilder` is no more, instead being replaced with `PgResourceOptions`
  and being built into the final `PgResource` via the new
  `makeRegistryBuilder`/`makeRegistry` functions.

  `build.input` no longer contains the `pgSources` directly, instead
  `build.input.pgRegistry.pgResources` should be used.

  The new registry system also means that various of the hooks in the gather
  phase have been renamed/replaced, there's a new `PgRegistryPlugin` plugin in
  the default preset. The only plugin that uses the `main` method in the
  `gather` phase is now `PgRegistryPlugin` - if you are using the `main`
  function for Postgres-related behaviors you should consider moving your logic
  to hooks instead.

  Plugin ordering has changed and thus the shape of the final schema is likely
  to change (please use `lexicographicSortSchema` on your before/after schemas
  when comparing).

  Relationships are now from a codec to a resource, rather than from resource to
  resource, so all the relationship inflectors (`singleRelation`,
  `singleRelationBackwards`, `_manyRelation`, `manyRelationConnection`,
  `manyRelationList`) now accept different parameters
  (`{registry, codec, relationName}` instead of `{source, relationaName}`).

  Significant type overhaul, most generic types no longer require generics to be
  explicitly passed in many circumstances. `PgSelectStep`, `PgSelectSingleStep`,
  `PgInsertStep`, `PgUpdateStep` and `PgDeleteStep` now all accept the resource
  as their single type parameter rather than accepting the 4 generics they did
  previously. `PgClassExpressionStep` now accepts just a codec and a resource as
  generics. `PgResource` and `PgCodec` have gained a new `TName extends string`
  generic at the very front that is used by the registry system to massively
  improve continuity of the types through all the various APIs.

  Fixed various issues in schema exporting, and detect more potential
  issues/oversights automatically.

  Fixes an RBAC bug when using superuser role for introspection.

- [#271](https://github.com/benjie/postgraphile-private/pull/271)
  [`261eb520b`](https://github.com/benjie/postgraphile-private/commit/261eb520b33fe3673fe3a7712085e50291aed1e5)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **RENAME ALL THE THINGS**

  The term 'source' was overloaded, and 'configs' was too vague, and
  'databaseName' was misleading, and 'source' behaviours actually applied to
  resources, and more. So, we've renamed lots of things as part of the API
  stabilization work. You're probably only affected by the first 2 bullet
  points.

  - `pgConfigs` -> `pgServices` (also applies to related `pgConfig` terms such
    as `makePgConfig` -> `makePgService`, `MakePgConfigOptions` ->
    `MakePgServiceOptions`, etc) - see your `graphile.config.ts` or equivalent
    file
  - All `*:source:*` behaviors are now `*:resource:*` behaviors (use regexp
    `/:source\b|\bsource:[a-z$]/` to find the places that need updating)
  - `PgDatabaseConfiguration` -> `PgServiceConfiguration`
  - `databaseName` -> `serviceName` (because it's not the name of the database,
    it's the name of the `pgServices` (which was `pgConfigs`) entry)
  - `PgResourceConfig::source` -> `PgResourceConfig.from` ('source' is
    overloaded, so use a more direct term)
  - `PgResource::source` -> `PgResource.from`
  - `PgSelectPlanJoin::source` -> `PgSelectPlanJoin.from`
  - `helpers.pgIntrospection.getDatabase` ->
    `helpers.pgIntrospection.getService`
  - `helpers.pgIntrospection.getExecutorForDatabase` ->
    `helpers.pgIntrospection.getExecutorForService`

## 8.0.0-0.5

### Patch Changes

- [`a8d26b30a`](undefined) - `ignoreReplaceIfNotExists` now truly ignores
  replacement inflectors. Better handle disabled NodePlugin.

## 8.0.0-0.4

### Patch Changes

- [#211](https://github.com/benjie/postgraphile-private/pull/211)
  [`f9c523bb6`](https://github.com/benjie/postgraphile-private/commit/f9c523bb66e91686ef43ed9fec4e4589c826bee2)
  Thanks [@benjie](https://github.com/benjie)! - Simplified relations should
  still respect foreignFieldName if present

## 8.0.0-0.3

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

## 8.0.0-0.2

### Patch Changes

- [#177](https://github.com/benjie/postgraphile-private/pull/177)
  [`6be68a53e`](https://github.com/benjie/postgraphile-private/commit/6be68a53e21940406a9fd629ee15cb1673497a6e)
  Thanks [@benjie](https://github.com/benjie)! - `@foreignFieldName` smart tag
  is now fed into the `inflection.connectionField(...)` or
  `inflection.listField(...)` inflector as appropriate. If you are using
  `@foreignSimpleFieldName` you may be able to delete that now; alternatively
  you should consider renaming `@foreignFieldName` to
  `@foreignConnectionFieldName` for consistency.

- [#176](https://github.com/benjie/postgraphile-private/pull/176)
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with plugin
  versioning. Add more TSDoc comments. New getTerminalWidth() helper.

## 8.0.0-0.1

### Patch Changes

- [`867121cfb`](undefined) - V5 port of @graphile-contrib/pg-simplify-inflector

This is based on V7 of @graphile-contrib/pg-simplify-inflector, rewritten for
PostGraphile V5. The previous versions relate to
@graphile-contrib/pg-simplify-inflector instead.

# v7.0.0

### Simplify primary key to primary key references

If you have two tables that share a primary key value, this version will
simplify the reference. For example with the following database schema:

```sql
create table animals (
  id serial primary key,
  name text
);

create table dogs (
  animal_id int primary key references animals,
  wags_tail bool
);
```

This will create `Animal.dog` (rather than `Animal.dogById`) and `Dog.animal`
(rather than `Dog.animalById`).

# v6.1.0

### Add `@listSuffix` smart tag

Previously there was no easy way to override `pgOmitListSuffix` on a per-entity
basis. With the `@listSuffix` tag you can selectively control naming of both
collection types:

```sql
create table companies (id serial primary key);
comment on table companies is E'@listSuffix omit';
```

By default (`pgOmitListSuffix = null` and `simpleCollections = 'both'`) this
produces:

```diff
-  allCompanies(
+  companiesConnection(
```

```diff
-  allCompaniesList(
+  companies(
```

# v6.0.0

#### Pluralization fixes

Previously we fed the entire table/etc name into `pluralize` but this causes
issues for special cases, for example while `pluralize('genus')` correctly gives
`genera`, `pluralize('old_genus')` would give `old_genus` which is not correct.

Now we segment on underscores/capitals and only pluralize the final segment, so
we're more likely to get the correct result.

This affects everywhere in your entire GraphQL schema where
pluralize/singularize is used.

#### Simplify multi-key relationships.

```sql
  foreign key (organization_id, team_id, goal_uuid) references goals
```

Now named better:

```diff
-  goalByOrganizationIdAndTeamIdAndGoalUuid: Goal
+  organizationTeamGoal: Goal
```

#### Unique relations get shorter-named reverse field.

This was a bug (or, really, an omission) in v5.

For this table:

```sql
create table mascots (
    id serial primary key,
    company_id int unique not null references companies,
    name text not null
);
```

Previously we had the plural relationship simplified:

```diff
-  mascotsByCompanyId(
+  mascots(
```

But the singular was not. This update changes the singular too:

```diff
-  mascotByCompanyId: Mascot
+  mascot: Mascot
```

# v5.0.0-beta.1

# v5.0.0-beta.0

More advanced guesses at field names for reverse relations. Ability to omit list
suffix, simplify patch names, turn on/off simplifying of the 'all' from
'allUsers', ability to change the 'ById' primary key fields to not have that
suffix and instead have the node ID fetchers have a suffix.

# v3.0.0

Simplifies naming in more of the schema.

# v2.0.0

Breaking change: single relation names based on a single key are now named after
the key rather than the target table so long as the key is of the form `foo_id`,
`foo_uuid`.

```sql
create table posts (
  id serial primary key,
  author_id int not null references users,
  body text not null
);
```

```diff
 type Post {
   nodeId: ID!
   id: Int!
   authorId: Int!
-  user: User
+  author: User
   body: String!
 }
```

# v1.0.0

Initial release
