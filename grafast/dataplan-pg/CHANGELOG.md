# @dataplan/pg

## 0.0.1-alpha.10

### Patch Changes

- [#362](https://github.com/benjie/postgraphile-private/pull/362)
  [`77e011294`](https://github.com/benjie/postgraphile-private/commit/77e01129450ab78d55d3868661e37b0c99db3da5)
  Thanks [@benjie](https://github.com/benjie)! - Forbid duplicate codec/resource
  names.

- [#362](https://github.com/benjie/postgraphile-private/pull/362)
  [`e443db39b`](https://github.com/benjie/postgraphile-private/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)
  Thanks [@benjie](https://github.com/benjie)! - Use original case for table
  resource names.

- Updated dependencies
  [[`339fe20d0`](https://github.com/benjie/postgraphile-private/commit/339fe20d0c6e8600d263ce8093cd85a6ea8adbbf),
  [`56237691b`](https://github.com/benjie/postgraphile-private/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/postgraphile-private/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/postgraphile-private/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/postgraphile-private/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/postgraphile-private/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - pg-sql2@5.0.0-alpha.3
  - grafast@0.0.1-alpha.9
  - graphile-config@0.0.1-alpha.4
  - @dataplan/json@0.0.1-alpha.9

## 0.0.1-alpha.9

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/postgraphile-private/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8
  - @dataplan/json@0.0.1-alpha.8

## 0.0.1-alpha.8

### Patch Changes

- [#341](https://github.com/benjie/postgraphile-private/pull/341)
  [`2fcbe688c`](https://github.com/benjie/postgraphile-private/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb)
  Thanks [@benjie](https://github.com/benjie)! - Ensure interfaces with zero
  implementations don't cause a crash.

- [#345](https://github.com/benjie/postgraphile-private/pull/345)
  [`3a984718a`](https://github.com/benjie/postgraphile-private/commit/3a984718a322685304777dec7cd48a1efa15539d)
  Thanks [@benjie](https://github.com/benjie)! - Cursor validation errors are
  now raised by the connection directly, rather than the subfields.

- [#340](https://github.com/benjie/postgraphile-private/pull/340)
  [`fe9154b23`](https://github.com/benjie/postgraphile-private/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215)
  Thanks [@benjie](https://github.com/benjie)! - Make Datetime RFC3339
  compatible when a timezone is present

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/postgraphile-private/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`2fcbe688c`](https://github.com/benjie/postgraphile-private/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/postgraphile-private/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`adc7ae5e0`](https://github.com/benjie/postgraphile-private/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - graphile-config@0.0.1-alpha.3
  - @dataplan/json@0.0.1-alpha.7

## 0.0.1-alpha.7

### Patch Changes

- [#338](https://github.com/benjie/postgraphile-private/pull/338)
  [`ca1526b70`](https://github.com/benjie/postgraphile-private/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6)
  Thanks [@benjie](https://github.com/benjie)! - Fix startCursor/endCursor for
  connections using pgUnionAll steps.

- [#338](https://github.com/benjie/postgraphile-private/pull/338)
  [`3426b0f4a`](https://github.com/benjie/postgraphile-private/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)
  Thanks [@benjie](https://github.com/benjie)! - Fix bugs in pgUnionAll
  connections relating to PageInfo

- Updated dependencies
  [[`f75926f4b`](https://github.com/benjie/postgraphile-private/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)]:
  - grafast@0.0.1-alpha.6
  - @dataplan/json@0.0.1-alpha.6

## 0.0.1-alpha.6

### Patch Changes

- Updated dependencies
  [[`86e503d78`](https://github.com/benjie/postgraphile-private/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`24822d0dc`](https://github.com/benjie/postgraphile-private/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - grafast@0.0.1-alpha.5
  - @dataplan/json@0.0.1-alpha.5

## 0.0.1-alpha.5

### Patch Changes

- [#334](https://github.com/benjie/postgraphile-private/pull/334)
  [`1ea7acdf5`](https://github.com/benjie/postgraphile-private/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)
  Thanks [@benjie](https://github.com/benjie)! - Tweak peerDependencies

## 0.0.1-alpha.4

### Patch Changes

- [`f34bd5a3c`](https://github.com/benjie/postgraphile-private/commit/f34bd5a3c353693b86a0307357a3620110700e1c)
  Thanks [@benjie](https://github.com/benjie)! - Address dependency issues.

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/postgraphile-private/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)]:
  - grafast@0.0.1-alpha.4
  - @dataplan/json@0.0.1-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`98ae00f59`](https://github.com/benjie/postgraphile-private/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`2389f47ec`](https://github.com/benjie/postgraphile-private/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`82cc01152`](https://github.com/benjie/postgraphile-private/commit/82cc01152ee06dafce45299661afd77ad943d785),
  [`e91ee201d`](https://github.com/benjie/postgraphile-private/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/postgraphile-private/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/postgraphile-private/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - @graphile/lru@5.0.0-alpha.2
  - grafast@0.0.1-alpha.3
  - pg-sql2@5.0.0-alpha.2
  - @dataplan/json@0.0.1-alpha.3

## 0.0.1-alpha.2

### Patch Changes

- Updated dependencies
  [[`3df3f1726`](https://github.com/benjie/postgraphile-private/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafast@0.0.1-alpha.2
  - @dataplan/json@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - @dataplan/json@0.0.1-alpha.1
  - grafast@0.0.1-alpha.1
  - @graphile/lru@5.0.0-alpha.1
  - pg-sql2@5.0.0-alpha.1

## 0.0.1-1.3

### Patch Changes

- Updated dependencies
  [[`8d270ead3`](https://github.com/benjie/postgraphile-private/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf)]:
  - grafast@0.0.1-1.3
  - @dataplan/json@0.0.1-1.3

## 0.0.1-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/postgraphile-private/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2
  - @dataplan/json@0.0.1-1.2

## 0.0.1-1.1

### Patch Changes

- [#279](https://github.com/benjie/postgraphile-private/pull/279)
  [`2df36c5a1`](https://github.com/benjie/postgraphile-private/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7)
  Thanks [@benjie](https://github.com/benjie)! - `description` moved out of
  `extensions` to live directly on all the relevant entities.

- [#279](https://github.com/benjie/postgraphile-private/pull/279)
  [`a73f9c709`](https://github.com/benjie/postgraphile-private/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26)
  Thanks [@benjie](https://github.com/benjie)! -
  `PgConnectionArgFirstLastBeforeAfterPlugin` is now
  `PgFirstLastBeforeAfterArgsPlugin` (because it applies to lists as well as
  connections).
  `PgInsertStep`/`pgInsert()`/`PgUpdateStep`/`pgUpdate()`/`PgDeleteStep`/`pgDelete()`
  are now
  `PgInsertSingleStep`/`pgInsertSingle()`/`PgUpdateSingleStep`/`pgUpdateSingle()`/`PgDeleteSingleStep`/`pgDeleteSingle()`
  (to make space to add a future bulk API if we want to).
  `config.schema.orderByNullsLast` is now `config.schema.pgOrderByNullsLast` for
  consistency (V4 preset users are unaffected). Lots of field scopes in
  `graphile-build-pg` have been updated to incorporate `field` into their names.

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`ef42d717c`](https://github.com/benjie/postgraphile-private/commit/ef42d717c38df7fddc1cd3a5b97dc8d68419417a)
  Thanks [@benjie](https://github.com/benjie)! - SQL is now generated in a
  slightly different way, helping PostgreSQL to optimize queries that have a
  batch size of 1. Also removes internal mapping code as we now simply append
  placeholder values rather than search and replacing a symbol (eradicates
  `queryValuesSymbol` and related hacks). If you manually issue queries through
  `PgExecutor` (_extremely_ unlikely!) then you'll want to check out PR #270 to
  see the differences.

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#265](https://github.com/benjie/postgraphile-private/pull/265)
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8)
  Thanks [@benjie](https://github.com/benjie)! - 'extensions.graphile' is now
  'extensions.grafast'

- [#259](https://github.com/benjie/postgraphile-private/pull/259)
  [`c22dcde7b`](https://github.com/benjie/postgraphile-private/commit/c22dcde7b53af323d907b22a0a69924841072aa9)
  Thanks [@benjie](https://github.com/benjie)! - Renamed `recordType` codec
  factory to `recordCodec`. `recordCodec()` now only accepts a single object
  argument. Renamed `enumType` codec factory to `enumCodec`. `enumCodec()` now
  only accepts a single object argument. Rename `listOfType` to `listOfCodec`.

  Massive overhaul of PgTypeCodec, PgTypeColumn and PgTypeColumns generics -
  types should be passed through much deeper now, but if you reference any of
  these types directly you'll need to update your code.

- [#285](https://github.com/benjie/postgraphile-private/pull/285)
  [`bd37be707`](https://github.com/benjie/postgraphile-private/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1)
  Thanks [@benjie](https://github.com/benjie)! - Single table inheritance no
  longer exposes non-shared columns via condition/order, and also only exposes
  the relationships on the types where they are appropriate.

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`f8954fb17`](https://github.com/benjie/postgraphile-private/commit/f8954fb17bbcb0f6633475d09924cdd9f94aaf23)
  Thanks [@benjie](https://github.com/benjie)! - `EXPLAIN ANALYZE` (for
  `SELECT`) and `EXPLAIN` (for other operations) support added. Currently
  requires `DEBUG="datasource:pg:PgExecutor:explain"` to be set. Publish this
  through all the way to Ruru.

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

- [#279](https://github.com/benjie/postgraphile-private/pull/279)
  [`fbf1da26a`](https://github.com/benjie/postgraphile-private/commit/fbf1da26a9208519ee58f7ac34dd7e569bf1f9e5)
  Thanks [@benjie](https://github.com/benjie)! - listOfCodec type signature
  changed: all parameters after the first are now a single config object:
  `listOfCodec(listedCodec, extensions, typeDelim, identifier)` ->
  `listOfCodec(listedCodec, { extensions, typeDelim, identifier })`.

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`c564825f3`](https://github.com/benjie/postgraphile-private/commit/c564825f3fda0083e536154c4c34ce0b2948eba4)
  Thanks [@benjie](https://github.com/benjie)! - `set jit = 'off'` replaced with
  `set jit_optimize_above_cost = -1` so that JIT can still be used but heavy
  optimization costs are not incurred.

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

- [#266](https://github.com/benjie/postgraphile-private/pull/266)
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)
  Thanks [@benjie](https://github.com/benjie)! - The Grafast step class
  'execute' and 'stream' methods now have a new additional first argument
  `count` which indicates how many results they must return. This means we don't
  need to rely on the `values[0].length` trick to determine how many results to
  return, and thus we can pass through an empty tuple to steps that have no
  dependencies.
- Updated dependencies
  [[`ae304b33c`](https://github.com/benjie/postgraphile-private/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/postgraphile-private/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`f93c79b94`](https://github.com/benjie/postgraphile-private/commit/f93c79b94eb93ae04b1b2e0478f5106e1aca8ee2),
  [`53e164cbc`](https://github.com/benjie/postgraphile-private/commit/53e164cbca7eaf1e6e03c849ac1bbe1789c61105),
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)]:
  - grafast@0.0.1-1.1
  - @dataplan/json@0.0.1-1.1
  - pg-sql2@5.0.0-1.1
  - @graphile/lru@5.0.0-1.1

## 0.0.1-0.28

### Patch Changes

- [#257](https://github.com/benjie/postgraphile-private/pull/257)
  [`9e7183c02`](https://github.com/benjie/postgraphile-private/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)
  Thanks [@benjie](https://github.com/benjie)! - Don't mangle class names, we
  want them for debugging.

- [#257](https://github.com/benjie/postgraphile-private/pull/257)
  [`fce77f40e`](https://github.com/benjie/postgraphile-private/commit/fce77f40efb194a3dfa7f38bfe20eb99e09efa70)
  Thanks [@benjie](https://github.com/benjie)! - Maintain types through
  lambda/list (if you get type errors after this update, you may need to put
  'readonly' in more of your types).
- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/postgraphile-private/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/postgraphile-private/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)]:
  - grafast@0.0.1-0.23
  - pg-sql2@5.0.0-0.4
  - @dataplan/json@0.0.1-0.23

## 0.0.1-0.27

### Patch Changes

- Updated dependencies []:
  - grafast@0.0.1-0.22
  - @dataplan/json@0.0.1-0.22

## 0.0.1-0.26

### Patch Changes

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`13cfc7501`](https://github.com/benjie/postgraphile-private/commit/13cfc75019d42353c1e6be394c28c6ba61ab32d0)
  Thanks [@benjie](https://github.com/benjie)! - pgConfig.listen is no more; it
  was redundant versus PgSubscriber. Have migrated PgIntrospectionPlugin to use
  PgSubscriber instead.
- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/postgraphile-private/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)]:
  - grafast@0.0.1-0.21
  - @dataplan/json@0.0.1-0.21

## 0.0.1-0.25

### Patch Changes

- Updated dependencies [[`aac8732f9`](undefined)]:
  - grafast@0.0.1-0.20
  - @dataplan/json@0.0.1-0.20

## 0.0.1-0.24

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/postgraphile-private/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19
  - @dataplan/json@0.0.1-0.19

## 0.0.1-0.23

### Patch Changes

- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/postgraphile-private/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`c8a56cdc8`](https://github.com/benjie/postgraphile-private/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c)]:
  - grafast@0.0.1-0.18
  - @dataplan/json@0.0.1-0.18

## 0.0.1-0.22

### Patch Changes

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17
  - @dataplan/json@0.0.1-0.17

## 0.0.1-0.21

### Patch Changes

- [#214](https://github.com/benjie/postgraphile-private/pull/214)
  [`7e3bfef04`](https://github.com/benjie/postgraphile-private/commit/7e3bfef04ebb76fbde8273341ec92073b9e9f04d)
  Thanks [@benjie](https://github.com/benjie)! - Correctly drop null/undefined
  pgSettings keys

- Updated dependencies
  [[`df89aba52`](https://github.com/benjie/postgraphile-private/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5)]:
  - grafast@0.0.1-0.16
  - @dataplan/json@0.0.1-0.16

## 0.0.1-0.20

### Patch Changes

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`2bd4b619e`](https://github.com/benjie/postgraphile-private/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99)
  Thanks [@benjie](https://github.com/benjie)! - Add
  `extensions.pg = { databaseName, schemaName, name }` to various DB-derived
  resources (codecs, sources, etc); this replaces the `originalName` temporary
  solution that we had previously.

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)]:
  - grafast@0.0.1-0.15
  - @dataplan/json@0.0.1-0.15

## 0.0.1-0.19

### Patch Changes

- [#204](https://github.com/benjie/postgraphile-private/pull/204)
  [`92c2378f2`](https://github.com/benjie/postgraphile-private/commit/92c2378f297cc917f542b126e1cdddf58e1f0fc3)
  Thanks [@benjie](https://github.com/benjie)! - Ensure codecs 'toPg' and
  'fromPg' never have to handle null.

- [#206](https://github.com/benjie/postgraphile-private/pull/206)
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.
- Updated dependencies
  [[`d76043453`](https://github.com/benjie/postgraphile-private/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79),
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/postgraphile-private/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14
  - @dataplan/json@0.0.1-0.14

## 0.0.1-0.18

### Patch Changes

- [#202](https://github.com/benjie/postgraphile-private/pull/202)
  [`a14bd2288`](https://github.com/benjie/postgraphile-private/commit/a14bd2288532b0977945d1c0508e51baef6dba2b)
  Thanks [@benjie](https://github.com/benjie)! - Expose
  pgWhereConditionSpecListToSQL helper function.

- [#201](https://github.com/benjie/postgraphile-private/pull/201)
  [`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

## 0.0.1-0.17

### Patch Changes

- [`e5b664b6f`](undefined) - Fix "Cannot find module '../package.json'" error

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - grafast@0.0.1-0.13
  - @dataplan/json@0.0.1-0.13

## 0.0.1-0.16

### Patch Changes

- [#197](https://github.com/benjie/postgraphile-private/pull/197)
  [`4f5d5bec7`](https://github.com/benjie/postgraphile-private/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36)
  Thanks [@benjie](https://github.com/benjie)! - Fix importing subpaths via ESM

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`fb40bd97b`](https://github.com/benjie/postgraphile-private/commit/fb40bd97b8a36da91c6b08e0ce67f1a9419ad91f)
  Thanks [@benjie](https://github.com/benjie)! - Move PgSubscriber to
  @dataplan/pg/adaptors/pg and automatically build it if you set `pubsub: true`
  in your `makePgConfig` call.
- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/postgraphile-private/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`25f5a6cbf`](https://github.com/benjie/postgraphile-private/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - grafast@0.0.1-0.12
  - @dataplan/json@0.0.1-0.12

## 0.0.1-0.15

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#196](https://github.com/benjie/postgraphile-private/pull/196)
  [`af9bc38c8`](https://github.com/benjie/postgraphile-private/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7)
  Thanks [@benjie](https://github.com/benjie)! - Allow passing `pool` directly
  to `makePgConfig`.

- [#190](https://github.com/benjie/postgraphile-private/pull/190)
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Breaking changes around
  types and postgres configuration:

  - `GraphileBuild.GraphileResolverContext` renamed to `Grafast.Context`
  - `GraphileConfig.GraphQLRequestContext` renamed to `Grafast.RequestContext`
  - `Grafast.PgDatabaseAdaptorOptions` renaed to
    `GraphileConfig.PgDatabaseAdaptorOptions`
  - `@dataplan/pg/adaptors/node-postgres` is now `@dataplan/pg/adaptors/pg` due
    to the bizarre naming of PostgreSQL clients on npm - we've decided to use
    the module name as the unique identifier
  - `makePgConfigs`:
    - is now `makePgConfig` (singular) - so you'll need to wrap it in an array
      where you use it
    - no longer exported by `@dataplan/pg` (because it depended on `pg`) -
      instead each adaptor exposes this helper - so import from
      `@dataplan/pg/adaptors/node-postgres`
    - accepts an object parameter containing
      `{connectionString, schemas, superuserConnectionString}`, rather than
      multiple string parameters
  - `makeNodePostgresWithPgClient` -> `makePgAdaptorWithPgClient`
  - `postgraphile` CLI will now try and respect the adaptor stated in your
    preset when overriding connection arguments
  - Removed `Grafast.RequestContext.httpRequest` and instead use
    `Grafast.RequestContext.node.req/res`; all server adaptors should implement
    this if appropriate

- [#192](https://github.com/benjie/postgraphile-private/pull/192)
  [`80091a8e0`](https://github.com/benjie/postgraphile-private/commit/80091a8e0343a162bf2b60cf619267a874a67e60)
  Thanks [@benjie](https://github.com/benjie)! - - Conflicts in `pgConfigs`
  (e.g. multiple sources using the same 'name') now detected and output
  - Fix defaults for `pgSettingsKey` and `withPgClientKey` based on config name
  - `makePgConfig` now allows passing `pgSettings` callback and
    `pgSettingsForIntrospection` config object
  - Multiple postgres sources now works nicely with multiple `makePgConfig`
    calls
- Updated dependencies [[`0ab95d0b1`](undefined),
  [`4783bdd7c`](https://github.com/benjie/postgraphile-private/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876)]:
  - @dataplan/json@0.0.1-0.11
  - grafast@0.0.1-0.11
  - pg-sql2@5.0.0-0.3

## 0.0.1-0.14

### Patch Changes

- Updated dependencies []:
  - grafast@0.0.1-0.10
  - @dataplan/json@0.0.1-0.10

## 0.0.1-0.13

### Patch Changes

- Updated dependencies
  [[`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - grafast@0.0.1-0.9
  - @dataplan/json@0.0.1-0.9

## 0.0.1-0.12

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8
  - @dataplan/json@0.0.1-0.8

## 0.0.1-0.11

### Patch Changes

- [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)
  Thanks [@benjie](https://github.com/benjie)! - Add new
  `--superuser-connection` option to allow installing watch fixtures as
  superuser.

## 0.0.1-0.10

### Patch Changes

- Updated dependencies []:
  - grafast@0.0.1-0.7
  - @dataplan/json@0.0.1-0.7

## 0.0.1-0.9

### Patch Changes

- [`c4213e91d`](undefined) - Add pgl.getResolvedPreset() API; fix Ruru
  respecting graphqlPath setting; replace 'instance' with 'pgl'/'serv' as
  appropriate; forbid subscriptions on GET

## 0.0.1-0.8

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - pg-sql2@5.0.0-0.2
  - @dataplan/json@0.0.1-0.6

## 0.0.1-0.7

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - @dataplan/json@0.0.1-0.5

## 0.0.1-0.6

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - @dataplan/json@0.0.1-0.4
  - grafast@0.0.1-0.4

## 0.0.1-0.5

### Patch Changes

- [`9ebe3d860`](undefined) - Fix issue with webpack bundling adaptor

## 0.0.1-0.4

### Patch Changes

- [`bf83f591d`](undefined) - Fix deps

## 0.0.1-0.3

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3

## 0.0.1-0.2

### Patch Changes

- [`25037fc15`](undefined) - Fix distribution of TypeScript types

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2

## 0.0.1-0.1

### Patch Changes

- [`55f15cf35`](undefined) - Tweaked build script

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1

## 0.0.1-0.0

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - pg-sql2@5.0.0-0.1
