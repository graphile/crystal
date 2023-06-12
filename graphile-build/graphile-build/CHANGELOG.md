# graphile-build

## 5.0.0-alpha.10

### Patch Changes

- [#349](https://github.com/benjie/postgraphile-private/pull/349)
  [`a94f11091`](https://github.com/benjie/postgraphile-private/commit/a94f11091520b52d90fd007986760848ed20017b)
  Thanks [@benjie](https://github.com/benjie)! - **Overhaul behavior system**

  Previously the behavior system worked during the schema building process,
  inside the various schema hooks. So looking at the behavior of a `relation`
  might have looked like:

  ```ts
  GraphQLObjectType_fields_field(field, build, context) {
    const relation = context.scope.pgRelationOrWhatever;

    // Establish a default behavior, e.g. you might give it different default behavior
    // depending on if the remote table is in the same schema or not
    const defaultBehavior = someCondition(relation) ? "behavior_if_true" : "behavior_if_false";

    // Now establish the user-specified behavior for the entity, inheriting from all the
    // relevant places.
    const behavior = getBehavior([
      relation.remoteResource.codec.extensions,
      relation.remoteResource.extensions,
      relation.extensions
    ]);

    // Finally check this behavior string against `behavior_to_test`, being sure to apply
    // the "schema-time smart defaulting" that we established in `defaultBehavior` above.
    if (build.behavior.matches(behavior, "behavior_to_test", defaultBehavior)) {
      doTheThing();
    }
  ```

  This meant that each plugin might treat the behavior of the entity different -
  for example `postgraphile-plugin-connection-filter` might have a different
  `someCondition()` under which the "filter" behavior would apply by default,
  whereas the built in `condition` plugin might have a different one.

  Moreover, each place needs to know to call `getBehavior` with the same list of
  extension sources in the same order, otherwise subtle (or not so subtle)
  differences in the schema would occur.

  And finally, because each entity doesn't have an established behavior, you
  can't ask "what's the final behavior for this entity" because it's dynamic,
  depending on which plugin is viewing it.

  This update fixes all of this; now each entity has a single behavior that's
  established once. Each plugin can register `entityBehaviors` for the various
  behavior entity types (or global behaviors which apply to all entity types if
  that makes more sense). So the hook code equivalent to the above would now be
  more like:

  ```ts
  GraphQLObjectType_fields_field(field, build, context) {
    const relation = context.scope.pgRelationOrWhatever;
    // Do the thing if the relation has the given behavior. Simples.
    if (build.behavior.pgCodecRelationMatches(relation, "behavior_to_test")) {
      doTheThing();
    }
  ```

  This code is much more to the point, much easier for plugin authors to
  implement, and also a lot easier to debug since everything has a single
  established behavior now (except `refs`, which aren't really an entity in
  their own right, but a combination of entities...).

  These changes haven't changed any of the schemas in the test suite, but they
  may impact you. This could be a breaking change - so be sure to do a schema
  diff before/after this.

- [#361](https://github.com/benjie/postgraphile-private/pull/361)
  [`dad4d4aae`](https://github.com/benjie/postgraphile-private/commit/dad4d4aaee499098104841740c9049b1deb6ac5f)
  Thanks [@benjie](https://github.com/benjie)! - Instead of passing
  resolvedPreset to behaviors, pass Build.

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/postgraphile-private/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/postgraphile-private/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/postgraphile-private/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/postgraphile-private/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/postgraphile-private/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - grafast@0.0.1-alpha.9
  - graphile-config@0.0.1-alpha.4

## 5.0.0-alpha.9

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/postgraphile-private/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8

## 5.0.0-alpha.8

### Patch Changes

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

## 5.0.0-alpha.7

### Patch Changes

- Updated dependencies
  [[`f75926f4b`](https://github.com/benjie/postgraphile-private/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)]:
  - grafast@0.0.1-alpha.6

## 5.0.0-alpha.6

### Patch Changes

- [`2850e4732`](https://github.com/benjie/postgraphile-private/commit/2850e4732ff173347357dba048eaf3c1ef775497)
  Thanks [@benjie](https://github.com/benjie)! - Improve the error output when
  the schema fails to build.

- Updated dependencies
  [[`86e503d78`](https://github.com/benjie/postgraphile-private/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`24822d0dc`](https://github.com/benjie/postgraphile-private/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - grafast@0.0.1-alpha.5

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/postgraphile-private/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)]:
  - grafast@0.0.1-alpha.4

## 5.0.0-alpha.4

### Patch Changes

- [#332](https://github.com/benjie/postgraphile-private/pull/332)
  [`faa1c9eaa`](https://github.com/benjie/postgraphile-private/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)
  Thanks [@benjie](https://github.com/benjie)! - Adjust dependencies and
  peerDependencies and peerDependenciesMeta.

## 5.0.0-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`21e95326d`](https://github.com/benjie/postgraphile-private/commit/21e95326d72eaad7a8860c4c21a11736191f169b),
  [`2389f47ec`](https://github.com/benjie/postgraphile-private/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`e91ee201d`](https://github.com/benjie/postgraphile-private/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/postgraphile-private/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/postgraphile-private/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - graphile-export@0.0.2-alpha.2
  - grafast@0.0.1-alpha.3
  - graphile-config@0.0.1-alpha.2

## 5.0.0-alpha.2

### Patch Changes

- Updated dependencies
  [[`3df3f1726`](https://github.com/benjie/postgraphile-private/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafast@0.0.1-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - grafast@0.0.1-alpha.1
  - graphile-config@0.0.1-alpha.1
  - graphile-export@0.0.2-alpha.1

## 5.0.0-1.3

### Patch Changes

- Updated dependencies
  [[`8d270ead3`](https://github.com/benjie/postgraphile-private/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`b4eaf89f4`](https://github.com/benjie/postgraphile-private/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2

## 5.0.0-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/postgraphile-private/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2

## 5.0.0-1.1

### Patch Changes

- [#287](https://github.com/benjie/postgraphile-private/pull/287)
  [`c5d89d705`](https://github.com/benjie/postgraphile-private/commit/c5d89d7052dfaaf4c597c8c36858795fa7227b07)
  Thanks [@benjie](https://github.com/benjie)! - Fix the type definition of
  GatherHooks to allow plugins to indicate individual gather hook ordering.

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#265](https://github.com/benjie/postgraphile-private/pull/265)
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8)
  Thanks [@benjie](https://github.com/benjie)! - 'extensions.graphile' is now
  'extensions.grafast'

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

- Updated dependencies
  [[`ae304b33c`](https://github.com/benjie/postgraphile-private/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/postgraphile-private/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)]:
  - grafast@0.0.1-1.1
  - graphile-config@0.0.1-1.1
  - graphile-export@0.0.2-1.1

## 5.0.0-0.29

### Patch Changes

- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/postgraphile-private/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/postgraphile-private/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)]:
  - grafast@0.0.1-0.23

## 5.0.0-0.28

### Patch Changes

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`a50bc5be4`](https://github.com/benjie/postgraphile-private/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8)
  Thanks [@benjie](https://github.com/benjie)! - Introduce new
  GraphQLObjectType_fields_field_args_arg and
  GraphQLInterfaceType_fields_field_args_arg hooks to resolve some plugin
  ordering issues.

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`6fb7ef449`](https://github.com/benjie/postgraphile-private/commit/6fb7ef4494b4f61b3b1aa36642e51eb9ec99a941)
  Thanks [@benjie](https://github.com/benjie)! - Also trim the empty
  descriptions from interface fields/args in addition to all the existing places
  empty descriptions are trimmed.

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)
  Thanks [@benjie](https://github.com/benjie)! - Solve mutation issue in plugin
  ordering code which lead to heisenbugs.

- Updated dependencies
  [[`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)]:
  - graphile-config@0.0.1-0.6
  - grafast@0.0.1-0.22

## 5.0.0-0.27

### Patch Changes

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`b9a2236d4`](https://github.com/benjie/postgraphile-private/commit/b9a2236d43cc92e06085298e379de71f7fdedcb7)
  Thanks [@benjie](https://github.com/benjie)! - Remove deprecated
  'subscriptions' option

- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/postgraphile-private/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)]:
  - grafast@0.0.1-0.21

## 5.0.0-0.26

### Patch Changes

- Updated dependencies [[`aac8732f9`](undefined)]:
  - grafast@0.0.1-0.20

## 5.0.0-0.25

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/postgraphile-private/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19

## 5.0.0-0.24

### Patch Changes

- [#220](https://github.com/benjie/postgraphile-private/pull/220)
  [`2abc58cf6`](https://github.com/benjie/postgraphile-private/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245)
  Thanks [@benjie](https://github.com/benjie)! - Convert a few more more options
  from V4 to V5.

  Explicitly remove query batching functionality, instead use HTTP2+ or
  websockets or similar.

  Add schema exporting.

- [#223](https://github.com/benjie/postgraphile-private/pull/223)
  [`df8c06657`](https://github.com/benjie/postgraphile-private/commit/df8c06657e6f5a7d1444d86dc32fd750d1433223)
  Thanks [@benjie](https://github.com/benjie)! - `graphile-utils` now includes
  the `makeAddPgTableConditionPlugin` and `makeAddPgTableOrderByPlugin`
  generators, freshly ported from V4. The signatures of these functions has
  changed slightly, but the functionality is broadly the same.
- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/postgraphile-private/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`c8a56cdc8`](https://github.com/benjie/postgraphile-private/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c)]:
  - grafast@0.0.1-0.18

## 5.0.0-0.23

### Patch Changes

- [#219](https://github.com/benjie/postgraphile-private/pull/219)
  [`b58f5dfac`](https://github.com/benjie/postgraphile-private/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)
  Thanks [@benjie](https://github.com/benjie)! - Rename
  `GraphileBuild.GraphileBuildGatherOptions` to `GraphileBuild.GatherOptions`.
  Rename `GraphileBuild.GraphileBuildInflectionOptions` to
  `GraphileBuild.InflectionOptions`.

## 5.0.0-0.22

### Patch Changes

- [`f48860d4f`](undefined) - Allow adding resolver-only fields to planned types.

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17

## 5.0.0-0.21

### Patch Changes

- Updated dependencies
  [[`df89aba52`](https://github.com/benjie/postgraphile-private/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5)]:
  - grafast@0.0.1-0.16

## 5.0.0-0.20

### Patch Changes

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`2fb5001b4`](https://github.com/benjie/postgraphile-private/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d)
  Thanks [@benjie](https://github.com/benjie)! - retryOnInitFail implemented,
  and bug in introspection cache on error resolved.

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)]:
  - grafast@0.0.1-0.15

## 5.0.0-0.19

### Patch Changes

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

## 5.0.0-0.18

### Patch Changes

- [#201](https://github.com/benjie/postgraphile-private/pull/201)
  [`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

## 5.0.0-0.17

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - grafast@0.0.1-0.13

## 5.0.0-0.16

### Patch Changes

- [#198](https://github.com/benjie/postgraphile-private/pull/198)
  [`a1158d83e`](https://github.com/benjie/postgraphile-private/commit/a1158d83e2d26f7da0182ec2b651f7f1ec202f14)
  Thanks [@benjie](https://github.com/benjie)! - Gather phase initialState may
  now be asynchronous. If initialCache returns a promise, a helpful error
  message with advice is now raised.
- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/postgraphile-private/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`25f5a6cbf`](https://github.com/benjie/postgraphile-private/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - grafast@0.0.1-0.12

## 5.0.0-0.15

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

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

- Updated dependencies [[`0ab95d0b1`](undefined),
  [`4783bdd7c`](https://github.com/benjie/postgraphile-private/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876)]:
  - grafast@0.0.1-0.11
  - graphile-config@0.0.1-0.5

## 5.0.0-0.14

### Patch Changes

- [`72bf5f535`](undefined) - Overhaul the behavior system (see
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

## 5.0.0-0.13

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10

## 5.0.0-0.12

### Patch Changes

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)
  Thanks [@benjie](https://github.com/benjie)! - Fix potential construction loop
  on failure to construct a type

## 5.0.0-0.11

### Patch Changes

- [#176](https://github.com/benjie/postgraphile-private/pull/176)
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with plugin
  versioning. Add more TSDoc comments. New getTerminalWidth() helper.
- Updated dependencies
  [[`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9

## 5.0.0-0.10

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8

## 5.0.0-0.9

### Patch Changes

- [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a)
  Thanks [@benjie](https://github.com/benjie)! - Enable omitting update/delete
  mutations using behaviors on unique constraints.

## 5.0.0-0.8

### Patch Changes

- [`677c8f5fc`](undefined) - Create new getTags() introspection helper and use
  it. Rename GraphileBuild.GraphileBuildSchemaOptions to
  GraphileBuild.SchemaOptions. Fix a couple minor inflection bugs. Add some
  missing descriptions. Fix the initial inflection types to not leak
  implementation details. Fix inflectors to use ResolvedPreset rather than
  Preset.
- Updated dependencies []:
  - grafast@0.0.1-0.7

## 5.0.0-0.7

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - graphile-config@0.0.1-0.2

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5

## 5.0.0-0.5

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - grafast@0.0.1-0.4
  - graphile-export@0.0.2-0.4

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
