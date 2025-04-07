# postgraphile

## 5.0.0-beta.40

### Patch Changes

- Updated dependencies []:
  - grafserv@0.1.1-beta.24
  - graphile-build-pg@5.0.0-beta.38
  - @dataplan/pg@0.0.1-beta.32
  - graphile-utils@5.0.0-beta.38

## 5.0.0-beta.39

### Patch Changes

- [#2335](https://github.com/graphile/crystal/pull/2335)
  [`2f31836cb89a7ab27a8919803fe12b53a46d77e4`](https://github.com/graphile/crystal/commit/2f31836cb89a7ab27a8919803fe12b53a46d77e4)
  Thanks [@benjie](https://github.com/benjie)! - PgSelectStep and PgUnionAllStep
  now return objects rather than arrays/streams; thanks to the new Grafast
  .items() method and these classes being "opaque" steps this is _mostly_ a
  non-breaking change.

- [#2424](https://github.com/graphile/crystal/pull/2424)
  [`e6da5d956ab696932410e7172cedfacba71dbf5e`](https://github.com/graphile/crystal/commit/e6da5d956ab696932410e7172cedfacba71dbf5e)
  Thanks [@benjie](https://github.com/benjie)! - Small tweaks to make exported
  schemas have nicer formatting.

- [#2335](https://github.com/graphile/crystal/pull/2335)
  [`72b300b436a7acedaa7d0e3a7a5458d15a0e5396`](https://github.com/graphile/crystal/commit/72b300b436a7acedaa7d0e3a7a5458d15a0e5396)
  Thanks [@benjie](https://github.com/benjie)! - PgSelectStep's stream behavior
  updated to match the latest logic in Grafast.

- [#2376](https://github.com/graphile/crystal/pull/2376)
  [`da6f3c04efe3d8634c0bc3fcf93ac2518de85322`](https://github.com/graphile/crystal/commit/da6f3c04efe3d8634c0bc3fcf93ac2518de85322)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul Grafast to remove more
  input planning - inputs should be evaluated at runtime - and remove more
  plan-time step evaluation.

  `FieldArgs.get` is no more; use `FieldArgs.getRaw` or use `bakedInput()`
  (TODO: document) to get the "baked" version of a raw input value.

  Input object fields no longer have `applyPlan`/`inputPlan`, instead having the
  runtime equivalents `apply()` and `baked()`. `FieldArgs` is no longer
  available on input object fields, since these fields are no longer called at
  plantime; instead, the actual value is passed.

  `FieldArgs` gains `.typeAt(path)` method that details the GraphQL input type
  at the given path.

  Field arguments are no longer passed `FieldArgs`, instead they're passed a
  (similar) `FieldArg` object representing the argument value itself.

  `autoApplyAfterParentPlan` is no more - instead if an argument has `applyPlan`
  it will be called automatically unless it was called during the field plan
  resolver itself.

  `autoApplyAfterParentSubscribePlan` is no more - instead if an argument has
  `applySubscribePlan` it will be called automatically unless it was called
  during the field plan resolver itself.

  Field arguments no longer support `inputPlan` - use `bakedInput()` if you need
  that.

  Input fields no longer support `inputPlan`, `applyPlan`,
  `autoApplyAfterParentInputPlan` nor `autoApplyAfterParentApplyPlan`. Instead,
  `apply()` (which is called by `applyStep()` at runtime) has been added.

  `sqlValueWithCodec(value, codec)` can be used at runtime in places where
  `$step.placeholder($value, codec)` would have been used previously.
  `placeholder` has been removed from all places that are now runtime - namely
  the list of modifiers below...

  The following `ModifierStep` classes have all dropped their `Step` suffix,
  these `Modifier` classes now all run at runtime, and are thus no longer steps;
  they're invoked as part of the new `applyInput()` (TODO: document) step:

  - `ModifierStep` &rArr; `Modifier`
  - `PgBooleanFilterStep` &rArr; `PgBooleanFilter`
  - `PgClassFilterStep` &rArr; `PgClassFilter`
  - `PgConditionCapableParentStep` &rArr; `PgConditionCapableParent`
  - `PgConditionLikeStep` &rArr; `PgConditionLike`
  - `PgConditionStepMode` &rArr; `PgConditionMode`
  - `PgConditionStep` &rArr; `PgCondition`
  - `PgManyFilterStep` &rArr; `PgManyFilter`
  - `PgOrFilterStep` &rArr; `PgOrFilter`
  - `PgTempTableStep` &rArr; `PgTempTable`
  - `SetterCapableStep` &rArr; `SetterCapable`
  - `SetterStep` &rArr; `Setter`

  (Interestingly, other than the removal of `placeholder` and the fact they deal
  with runtime values rather than steps now, they're very similar to what they
  were before.)

  The deprecated forms of the above have been removed.

  Methods that rely on these modifier plans have been removed:

  - `PgUnionAllStep.wherePlan` - use
    `fieldArg.apply($unionAll, qb => qb.whereBuilder())` instead
  - `PgUnionAllStep.havingPlan` - use
    `fieldArg.apply($unionAll, qb => qb.havingBuilder())` instead
  - Same for PgSelectStep

  The following gain query builders:

  - `PgInsertSingle`
  - `PgUpdateSingle`
  - `PgDeleteSingle`

  Query builders gain `meta`, an object that can be augmented with metadata
  about the operation (typically this relates to cursors and similar
  functionality). This is now used to implement `clientMutationId`.

  Extends query builders with additional functionality.

  Many of the types have had their generics changed, TypeScript should guide you
  if you have issues here.

  `NodeIdHandler` now requires a `getIdentifiers` method that runs at runtime
  and returns the identifiers from a decoded NodeId string.

  Types around GraphQL Global Object Identification (i.e. `Node` / `id`) have
  changed.

- [#2357](https://github.com/graphile/crystal/pull/2357)
  [`8026b982a81776fb3d1d808392970c2d678c4023`](https://github.com/graphile/crystal/commit/8026b982a81776fb3d1d808392970c2d678c4023)
  Thanks [@benjie](https://github.com/benjie)! - Start migrating away from
  `applyPlan`/`inputPlan`. ~~When adding an argument to a field you can now
  augment the field's plan resolver via `context.addToPlanResolver` hook~~ (this
  was later replaced with new `inputApply()` step, and arguments still keep
  `applyPlan` though input object fields lose it). Use this and other changes to
  move handling of orderBy to runtime from plantime.

  Introduces runtime query builder for `PgSelectStep` and `PgUnionAllStep`, and
  `PgSelectStep.apply()`/`PgUnionAllStep.apply()` so that you can register
  callbacks that will augment the query builder at runtime.

- Updated dependencies
  [[`d34014a9a3c469154cc796086ba13719954731e5`](https://github.com/graphile/crystal/commit/d34014a9a3c469154cc796086ba13719954731e5),
  [`d3ae3415c230784fdfefc9d192ad93aca462bceb`](https://github.com/graphile/crystal/commit/d3ae3415c230784fdfefc9d192ad93aca462bceb),
  [`98516379ac355a0833a64e002f3717cc3a1d6473`](https://github.com/graphile/crystal/commit/98516379ac355a0833a64e002f3717cc3a1d6473),
  [`f8602d05eed3247c90b87c55d7af580d1698effc`](https://github.com/graphile/crystal/commit/f8602d05eed3247c90b87c55d7af580d1698effc),
  [`65df25534fa3f787ba2ab7fd9547d295ff2b1288`](https://github.com/graphile/crystal/commit/65df25534fa3f787ba2ab7fd9547d295ff2b1288),
  [`1b3c76efd27df73eab3a5a1d221ce13de4cd6b1a`](https://github.com/graphile/crystal/commit/1b3c76efd27df73eab3a5a1d221ce13de4cd6b1a),
  [`f6e22692b628703b8ea48e580dc0b6f0bcbc9c5a`](https://github.com/graphile/crystal/commit/f6e22692b628703b8ea48e580dc0b6f0bcbc9c5a),
  [`e10c372dafbe0d6014b1e946349b22f40aa87ef9`](https://github.com/graphile/crystal/commit/e10c372dafbe0d6014b1e946349b22f40aa87ef9),
  [`c3538050abbb485cf1d43f7c870b89f1ad7c2218`](https://github.com/graphile/crystal/commit/c3538050abbb485cf1d43f7c870b89f1ad7c2218),
  [`3c0a925f26f10cae627a23c49c75ccd8d76b60c8`](https://github.com/graphile/crystal/commit/3c0a925f26f10cae627a23c49c75ccd8d76b60c8),
  [`fcaeb48844156e258a037f420ea1505edb50c52a`](https://github.com/graphile/crystal/commit/fcaeb48844156e258a037f420ea1505edb50c52a),
  [`68926abc31c32ce527327ffbb1ede4b0b7be446b`](https://github.com/graphile/crystal/commit/68926abc31c32ce527327ffbb1ede4b0b7be446b),
  [`98c5009e21e423b0da22c2cb70cdb62909578f50`](https://github.com/graphile/crystal/commit/98c5009e21e423b0da22c2cb70cdb62909578f50),
  [`4b49dbd2df3b339a2ba3f1e9ff400fa1a125298b`](https://github.com/graphile/crystal/commit/4b49dbd2df3b339a2ba3f1e9ff400fa1a125298b),
  [`d7950e8e28ec6106a4ce2f7fe5e35d88b10eac48`](https://github.com/graphile/crystal/commit/d7950e8e28ec6106a4ce2f7fe5e35d88b10eac48),
  [`c8f1971ea4198633ec97f72f82abf65089f71a88`](https://github.com/graphile/crystal/commit/c8f1971ea4198633ec97f72f82abf65089f71a88),
  [`182ed0564104f59b012e0f9ffd452556b0927750`](https://github.com/graphile/crystal/commit/182ed0564104f59b012e0f9ffd452556b0927750),
  [`dd3d22eab73a8554715bf1111e30586251f69a88`](https://github.com/graphile/crystal/commit/dd3d22eab73a8554715bf1111e30586251f69a88),
  [`a120a8e43b24dfc174950cdbb69e481272a0b45e`](https://github.com/graphile/crystal/commit/a120a8e43b24dfc174950cdbb69e481272a0b45e),
  [`be1e558d6a1a8cae3bf4b5724c340469d8837504`](https://github.com/graphile/crystal/commit/be1e558d6a1a8cae3bf4b5724c340469d8837504),
  [`3b0f5082b2272997ce33ce8823a4752513d19e28`](https://github.com/graphile/crystal/commit/3b0f5082b2272997ce33ce8823a4752513d19e28),
  [`84f06eafa051e907a3050237ac6ee5aefb184652`](https://github.com/graphile/crystal/commit/84f06eafa051e907a3050237ac6ee5aefb184652),
  [`4a3aeaa77c8b8d2e39c1a9d05581d0c613b812cf`](https://github.com/graphile/crystal/commit/4a3aeaa77c8b8d2e39c1a9d05581d0c613b812cf),
  [`3789326b2e2fdb86519acc75e606c752ddefe590`](https://github.com/graphile/crystal/commit/3789326b2e2fdb86519acc75e606c752ddefe590),
  [`12d3a7174949794a1679132635e196f5dadce8a2`](https://github.com/graphile/crystal/commit/12d3a7174949794a1679132635e196f5dadce8a2),
  [`ab7658ac44e1a5a0a98c6bb688a26d94b1175cc1`](https://github.com/graphile/crystal/commit/ab7658ac44e1a5a0a98c6bb688a26d94b1175cc1),
  [`bc2a00d35f0a1954dba22e857adc3f4e2f5118e5`](https://github.com/graphile/crystal/commit/bc2a00d35f0a1954dba22e857adc3f4e2f5118e5),
  [`ceeb9a6b63e566b09298e0440a385943302ad0f9`](https://github.com/graphile/crystal/commit/ceeb9a6b63e566b09298e0440a385943302ad0f9),
  [`3e8c64bef928295494119e15e1e55cbdadb696fa`](https://github.com/graphile/crystal/commit/3e8c64bef928295494119e15e1e55cbdadb696fa),
  [`0fc2db95d90df918cf5c59ef85f22ac78d8000d3`](https://github.com/graphile/crystal/commit/0fc2db95d90df918cf5c59ef85f22ac78d8000d3),
  [`d68c5831ed66dc8a7a79aab2100ca733409c6f72`](https://github.com/graphile/crystal/commit/d68c5831ed66dc8a7a79aab2100ca733409c6f72),
  [`90e81a5deeae554a8be2dd55dcd01489860e96e6`](https://github.com/graphile/crystal/commit/90e81a5deeae554a8be2dd55dcd01489860e96e6),
  [`836c8327a5ca1bd3c69f72055e71d00694de363e`](https://github.com/graphile/crystal/commit/836c8327a5ca1bd3c69f72055e71d00694de363e),
  [`2f31836cb89a7ab27a8919803fe12b53a46d77e4`](https://github.com/graphile/crystal/commit/2f31836cb89a7ab27a8919803fe12b53a46d77e4),
  [`c59132eb7a93bc82493d2f1ca050db8aaea9f4d1`](https://github.com/graphile/crystal/commit/c59132eb7a93bc82493d2f1ca050db8aaea9f4d1),
  [`7c38cdeffe034c9b4f5cdd03a8f7f446bd52dcb7`](https://github.com/graphile/crystal/commit/7c38cdeffe034c9b4f5cdd03a8f7f446bd52dcb7),
  [`728888b28fcd2a6fc481e0ccdfe20d41181a091f`](https://github.com/graphile/crystal/commit/728888b28fcd2a6fc481e0ccdfe20d41181a091f),
  [`f4f39092d7a51517668384945895d3b450237cce`](https://github.com/graphile/crystal/commit/f4f39092d7a51517668384945895d3b450237cce),
  [`5cf3dc9d158891eaf324b2cd4f485d1d4bbb6b5e`](https://github.com/graphile/crystal/commit/5cf3dc9d158891eaf324b2cd4f485d1d4bbb6b5e),
  [`925689578ee9def403382df70f0e003bb299c166`](https://github.com/graphile/crystal/commit/925689578ee9def403382df70f0e003bb299c166),
  [`83d3b533e702cc875b46ba2ca02bf3642b421be8`](https://github.com/graphile/crystal/commit/83d3b533e702cc875b46ba2ca02bf3642b421be8),
  [`7001138c38e09822ad13db1018c62d2cac37941e`](https://github.com/graphile/crystal/commit/7001138c38e09822ad13db1018c62d2cac37941e),
  [`e9e7e33665e22ec397e9ead054d2e4aad3eadc8c`](https://github.com/graphile/crystal/commit/e9e7e33665e22ec397e9ead054d2e4aad3eadc8c),
  [`bb6ec8d834e3e630e28316196246f514114a2296`](https://github.com/graphile/crystal/commit/bb6ec8d834e3e630e28316196246f514114a2296),
  [`3e188c2e981193d228ba3b7433f5e326336f629b`](https://github.com/graphile/crystal/commit/3e188c2e981193d228ba3b7433f5e326336f629b),
  [`07a5469e5d3d050a7bcab928bb751c9e150d2e49`](https://github.com/graphile/crystal/commit/07a5469e5d3d050a7bcab928bb751c9e150d2e49),
  [`e6da5d956ab696932410e7172cedfacba71dbf5e`](https://github.com/graphile/crystal/commit/e6da5d956ab696932410e7172cedfacba71dbf5e),
  [`2b1918d053f590cdc534c8cb81f7e74e96c1bbe6`](https://github.com/graphile/crystal/commit/2b1918d053f590cdc534c8cb81f7e74e96c1bbe6),
  [`037a1bcdc8ed8493d4748e08c18f258e4382a815`](https://github.com/graphile/crystal/commit/037a1bcdc8ed8493d4748e08c18f258e4382a815),
  [`72b300b436a7acedaa7d0e3a7a5458d15a0e5396`](https://github.com/graphile/crystal/commit/72b300b436a7acedaa7d0e3a7a5458d15a0e5396),
  [`770363214ee630746cddc9080dec22bbf38a3bb5`](https://github.com/graphile/crystal/commit/770363214ee630746cddc9080dec22bbf38a3bb5),
  [`d1ecb39693a341f85762b27012ec4ea013857b0c`](https://github.com/graphile/crystal/commit/d1ecb39693a341f85762b27012ec4ea013857b0c),
  [`042ebafe11fcf7e2ecac9b131265a55dddd42a6d`](https://github.com/graphile/crystal/commit/042ebafe11fcf7e2ecac9b131265a55dddd42a6d),
  [`fa005eb0783c58a2476add984fbdd462e0e91dbe`](https://github.com/graphile/crystal/commit/fa005eb0783c58a2476add984fbdd462e0e91dbe),
  [`7bb77961a38abea8a07980a3f47bc3ca22dac8f8`](https://github.com/graphile/crystal/commit/7bb77961a38abea8a07980a3f47bc3ca22dac8f8),
  [`df0e5a0f968cf6f9ae97b68745a9a2f391324bf5`](https://github.com/graphile/crystal/commit/df0e5a0f968cf6f9ae97b68745a9a2f391324bf5),
  [`ef4cf75acd80e6b9c700c2b5a7ace899e565ef7f`](https://github.com/graphile/crystal/commit/ef4cf75acd80e6b9c700c2b5a7ace899e565ef7f),
  [`ba2bfa15deaaddd92757a56c2b761624afe940bd`](https://github.com/graphile/crystal/commit/ba2bfa15deaaddd92757a56c2b761624afe940bd),
  [`c041fd250372c57601188b65a6411c8f440afab6`](https://github.com/graphile/crystal/commit/c041fd250372c57601188b65a6411c8f440afab6),
  [`629b45aab49151810f6efc18ac18f7d735626433`](https://github.com/graphile/crystal/commit/629b45aab49151810f6efc18ac18f7d735626433),
  [`6d19724330d50d076aab9442660fa8abddd095cb`](https://github.com/graphile/crystal/commit/6d19724330d50d076aab9442660fa8abddd095cb),
  [`ca5bc1a834df7b894088fb8602a12f9fcff55b38`](https://github.com/graphile/crystal/commit/ca5bc1a834df7b894088fb8602a12f9fcff55b38),
  [`da6f3c04efe3d8634c0bc3fcf93ac2518de85322`](https://github.com/graphile/crystal/commit/da6f3c04efe3d8634c0bc3fcf93ac2518de85322),
  [`8026b982a81776fb3d1d808392970c2d678c4023`](https://github.com/graphile/crystal/commit/8026b982a81776fb3d1d808392970c2d678c4023),
  [`d257a1a1e59a7d4da0bf67345c07b04c04a2f7da`](https://github.com/graphile/crystal/commit/d257a1a1e59a7d4da0bf67345c07b04c04a2f7da),
  [`00d79e6f5608affc3f36bb0ce4ca2547230174e7`](https://github.com/graphile/crystal/commit/00d79e6f5608affc3f36bb0ce4ca2547230174e7),
  [`412b92a0b1e03ad962521f630b57a996d8620cf6`](https://github.com/graphile/crystal/commit/412b92a0b1e03ad962521f630b57a996d8620cf6),
  [`15854c5109114919b3d38fa675c539cda1f634a1`](https://github.com/graphile/crystal/commit/15854c5109114919b3d38fa675c539cda1f634a1),
  [`f0bc64b71914dfdd3612f4b65370401fd85b97bc`](https://github.com/graphile/crystal/commit/f0bc64b71914dfdd3612f4b65370401fd85b97bc)]:
  - grafast@0.1.1-beta.21
  - @dataplan/pg@0.0.1-beta.32
  - pg-sql2@5.0.0-beta.8
  - graphile-build-pg@5.0.0-beta.38
  - graphile-utils@5.0.0-beta.38
  - graphile-build@5.0.0-beta.33
  - @dataplan/json@0.0.1-beta.30
  - graphile-config@0.0.1-beta.15
  - grafserv@0.1.1-beta.23

## 5.0.0-beta.38

### Patch Changes

- Updated dependencies
  [[`fc9d64eb8`](https://github.com/graphile/crystal/commit/fc9d64eb8002d3b72625bc505ed76c07f4296d68),
  [`a2dbad945`](https://github.com/graphile/crystal/commit/a2dbad9457195bec797d72e4e6d45f45278f9f69),
  [`31078842a`](https://github.com/graphile/crystal/commit/31078842ad0eeaa7111491fa9eb5e3bd026fb38a),
  [`5a0ec31de`](https://github.com/graphile/crystal/commit/5a0ec31deae91f1dd17a77a4bb7c1a911a27e26a)]:
  - @dataplan/pg@0.0.1-beta.31
  - grafast@0.1.1-beta.20
  - graphile-build-pg@5.0.0-beta.37
  - graphile-utils@5.0.0-beta.37
  - @dataplan/json@0.0.1-beta.29
  - grafserv@0.1.1-beta.22
  - graphile-build@5.0.0-beta.32

## 5.0.0-beta.37

### Patch Changes

- Updated dependencies
  [[`83c546509`](https://github.com/graphile/crystal/commit/83c546509d24be2955a56120981363ad3c3a5f3f)]:
  - graphile-config@0.0.1-beta.14
  - @dataplan/pg@0.0.1-beta.30
  - grafast@0.1.1-beta.19
  - grafserv@0.1.1-beta.21
  - graphile-build@5.0.0-beta.31
  - graphile-build-pg@5.0.0-beta.36
  - graphile-utils@5.0.0-beta.36
  - @dataplan/json@0.0.1-beta.28

## 5.0.0-beta.36

### Patch Changes

- [#2279](https://github.com/graphile/crystal/pull/2279)
  [`b336a5829`](https://github.com/graphile/crystal/commit/b336a58291cfec7aef884d3843172d408abfaf3c)
  Thanks [@benjie](https://github.com/benjie)! - Introduce step caching to
  reduce deduplication workload safely, thereby reducing planning time for many
  larger queries.
- Updated dependencies
  [[`7580bc16a`](https://github.com/graphile/crystal/commit/7580bc16a050fd8d916c6dabe9d1ded980090349),
  [`b336a5829`](https://github.com/graphile/crystal/commit/b336a58291cfec7aef884d3843172d408abfaf3c)]:
  - graphile-config@0.0.1-beta.13
  - @dataplan/pg@0.0.1-beta.29
  - grafast@0.1.1-beta.18
  - grafserv@0.1.1-beta.20
  - graphile-build@5.0.0-beta.30
  - graphile-build-pg@5.0.0-beta.35
  - graphile-utils@5.0.0-beta.35
  - @dataplan/json@0.0.1-beta.27

## 5.0.0-beta.35

### Patch Changes

- [#2269](https://github.com/graphile/crystal/pull/2269)
  [`bee1db4f4`](https://github.com/graphile/crystal/commit/bee1db4f442502b62cb05cd0f7092990328497b8)
  Thanks [@benjie](https://github.com/benjie)! - Hotfix to inflection changes in
  beta.34 - fixes behavior of `orderByAttributeEnum` and removes V4 override of
  `_joinAttributeNames` which shouldn't be necessary (and seems to do more harm
  than good).
- Updated dependencies
  [[`bee1db4f4`](https://github.com/graphile/crystal/commit/bee1db4f442502b62cb05cd0f7092990328497b8)]:
  - graphile-build-pg@5.0.0-beta.34
  - graphile-utils@5.0.0-beta.34

## 5.0.0-beta.34

### Patch Changes

- [#2251](https://github.com/graphile/crystal/pull/2251)
  [`555d65cce`](https://github.com/graphile/crystal/commit/555d65ccecb875f1e34cb40108176f0ddc11df64)
  Thanks [@benjie](https://github.com/benjie)! - We now enforce GraphQL name
  checks earlier and supply more information to better reveal where any invalid
  names are originating.

- [#2251](https://github.com/graphile/crystal/pull/2251)
  [`efa25d97d`](https://github.com/graphile/crystal/commit/efa25d97df2e00f13bc29806d396a8366a121031)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **Inflection changes!** V4
  preset should be (mostly) unaffected, but Amber preset will likely have
  changes between `ID` and `ROW_ID` in various places, plus missing underscores
  may reappear/etc. Be sure to diff your schema before/after this update (as you
  should with every update... and to be honest, with everything else that
  changes your schema).

  Normally `camelCase`/`upperCamelCase`/`constantCase`/etc are the final step
  before we name a field/type/enumValue/etc; however it turns out that some
  inflectors were using the camel-cased output as input to their own
  inflection - for example, when calculating the name of a relation it would
  take the column names _camel-cased_ and then combine them into a string which
  was then camel-cased again. Even worse, when these values are then used in an
  enum, it would then be _constant-cased_, so you end up with string 👉
  camel-case 👉 concatenate 👉 camel-case 👉 concatenate 👉 constant-case. This
  lead to certain edge cases where fields with numbers or underscores may come
  out in unexpected ways.

  This release creates "raw" backing inflectors for a few things that remove the
  final step (camel-casing) so that later usage may choose to use the raw value
  rather than the camel-cased value. And due to this, we've also moved the `id`
  👉 `rowId` tweaks from the `attribute()` inflector into the `_attributeName()`
  inflector - which is where most of the changes have come from. We've undone
  this change in the V4 preset, so if you don't use the V5 preset but need to
  undo this change, please check out the V4 overrides of:

  - [`_attributeName`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/presets/v4.ts#L135-L145)
  - [`_joinAttributeNames`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/plugins/PgV4InflectionPlugin.ts#L131-L138)
  - [`attribute`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/presets/v4.ts#L158-L169)

  Note: the V4 preset is fairly stable, but the Amber preset is being constantly
  iterated to improve the OOTB V5 experience - it will only be stable once
  V5.0.0 is released.

- [#2252](https://github.com/graphile/crystal/pull/2252)
  [`d88b69d05`](https://github.com/graphile/crystal/commit/d88b69d0591601fb44b3e6e71b137b8235e70157)
  Thanks [@benjie](https://github.com/benjie)! - V4 preset now supports
  extendedErrors, showErrorStack and bodySizeLimit options.

- [#2257](https://github.com/graphile/crystal/pull/2257)
  [`2a37fb99a`](https://github.com/graphile/crystal/commit/2a37fb99a04784647dff6ab8c5bfffb072cc6e8a)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul how PostgreSQL arrays
  are handled, and fix the "empty arrays become null" bug caused by using
  `array_agg()`.

- [#2265](https://github.com/graphile/crystal/pull/2265)
  [`5d9f2de85`](https://github.com/graphile/crystal/commit/5d9f2de8519b216732b17464d0b326ec8d7c58de)
  Thanks [@benjie](https://github.com/benjie)! - Prevents inlining (via joins)
  child PgSelect queries into parents when the parent is relying on implicit
  ordering coming from a function or suitably flagged subquery.
- Updated dependencies
  [[`555d65cce`](https://github.com/graphile/crystal/commit/555d65ccecb875f1e34cb40108176f0ddc11df64),
  [`866673e14`](https://github.com/graphile/crystal/commit/866673e14f7ad76b6f6d83d1b4e3a4eff8fdba37),
  [`69ab227b5`](https://github.com/graphile/crystal/commit/69ab227b5e1c057a6fc8ebba87bde80d5aa7f3c8),
  [`efa25d97d`](https://github.com/graphile/crystal/commit/efa25d97df2e00f13bc29806d396a8366a121031),
  [`9a0f9e78c`](https://github.com/graphile/crystal/commit/9a0f9e78c4ee46f50f49bb068baddef7e1de4119),
  [`d13b76f0f`](https://github.com/graphile/crystal/commit/d13b76f0fef2a58466ecb44880af62d25910e83e),
  [`b167bd849`](https://github.com/graphile/crystal/commit/b167bd8499be5866b71bac6594d55bd768fda1d0),
  [`a202145c5`](https://github.com/graphile/crystal/commit/a202145c5af3e5467424e6772d532c2db1eb67c6),
  [`7bf045282`](https://github.com/graphile/crystal/commit/7bf04528264c3b9c509f148253fed96d3394141d),
  [`2a37fb99a`](https://github.com/graphile/crystal/commit/2a37fb99a04784647dff6ab8c5bfffb072cc6e8a),
  [`5d9f2de85`](https://github.com/graphile/crystal/commit/5d9f2de8519b216732b17464d0b326ec8d7c58de),
  [`6a13ecbd4`](https://github.com/graphile/crystal/commit/6a13ecbd45534c39c846c1d8bc58242108426dd1),
  [`84f07626d`](https://github.com/graphile/crystal/commit/84f07626d9dd9e22f6ae6a1045053df046fbc4ea),
  [`86e228299`](https://github.com/graphile/crystal/commit/86e22829996a745dc1f8cbaf32e709b1bd346e79),
  [`933786868`](https://github.com/graphile/crystal/commit/9337868689f4f05ab5faf2d4bb18a8ad8e23e189),
  [`cba6ee06d`](https://github.com/graphile/crystal/commit/cba6ee06d38ec5ae4ef4dafa58569fad61f239ac)]:
  - graphile-build-pg@5.0.0-beta.33
  - graphile-build@5.0.0-beta.29
  - grafserv@0.1.1-beta.19
  - grafast@0.1.1-beta.17
  - graphile-config@0.0.1-beta.12
  - pg-sql2@5.0.0-beta.7
  - @dataplan/pg@0.0.1-beta.28
  - graphile-utils@5.0.0-beta.33
  - @dataplan/json@0.0.1-beta.26

## 5.0.0-beta.33

### Patch Changes

- [#2229](https://github.com/graphile/crystal/pull/2229)
  [`87bdf9730`](https://github.com/graphile/crystal/commit/87bdf973036a3801e44b22cfc9f0feb639de4aa9)
  Thanks [@benjie](https://github.com/benjie)! - Fixes bug handling optional
  arguments to computed column functions.

- [#2230](https://github.com/graphile/crystal/pull/2230)
  [`aa480f6a3`](https://github.com/graphile/crystal/commit/aa480f6a3db8b545ff113e7a3a4b479be42a0eab)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug recognizing the
  required-ness of arguments to functions using `out` args or `returns table` -
  this particularly affects people using `pgStrictFunctions` and should result
  in a couple of required arguments becoming nullable.
- Updated dependencies
  [[`87bdf9730`](https://github.com/graphile/crystal/commit/87bdf973036a3801e44b22cfc9f0feb639de4aa9),
  [`5626c7d36`](https://github.com/graphile/crystal/commit/5626c7d3649285e11fe9857dfa319d2883d027eb),
  [`bf2a2e72a`](https://github.com/graphile/crystal/commit/bf2a2e72ab78a01f5aba6cda97b5a125563b1f3d),
  [`76c7340b7`](https://github.com/graphile/crystal/commit/76c7340b74d257c454beec883384d19ef078b21e),
  [`aa480f6a3`](https://github.com/graphile/crystal/commit/aa480f6a3db8b545ff113e7a3a4b479be42a0eab)]:
  - graphile-build-pg@5.0.0-beta.32
  - graphile-config@0.0.1-beta.11
  - grafserv@0.1.1-beta.18
  - grafast@0.1.1-beta.16
  - graphile-utils@5.0.0-beta.32
  - @dataplan/pg@0.0.1-beta.27
  - graphile-build@5.0.0-beta.28
  - @dataplan/json@0.0.1-beta.25

## 5.0.0-beta.32

### Patch Changes

- Updated dependencies
  [[`632691409`](https://github.com/graphile/crystal/commit/6326914098af55f20ac85ccf3537e75910a7dafa)]:
  - graphile-build-pg@5.0.0-beta.31
  - graphile-build@5.0.0-beta.27
  - graphile-utils@5.0.0-beta.31

## 5.0.0-beta.31

### Patch Changes

- Updated dependencies
  [[`0b1f7b577`](https://github.com/graphile/crystal/commit/0b1f7b577114a49b8e3283823845ec6e37484240)]:
  - graphile-build-pg@5.0.0-beta.30
  - graphile-build@5.0.0-beta.26
  - graphile-utils@5.0.0-beta.30

## 5.0.0-beta.30

### Patch Changes

- [#2197](https://github.com/graphile/crystal/pull/2197)
  [`d7e6e714f`](https://github.com/graphile/crystal/commit/d7e6e714f0cc5656112703484298b77538b2dccc)
  Thanks [@benjie](https://github.com/benjie)! - Amber preset now supports
  `@resultFieldName` on mutation functions, like V4 preset does.

- [#2187](https://github.com/graphile/crystal/pull/2187)
  [`bb006ec7b`](https://github.com/graphile/crystal/commit/bb006ec7bdab24192c84f093ce3f92969aeb7279)
  Thanks [@benjie](https://github.com/benjie)! - Fix behavior inheritance
  especially around functions incorrectly inheriting from their underlying
  codecs, bugs in unlogged/temp table behavior, and incorrect skipping of
  generating table types. You may find after this change you have fields
  appearing in your schema that were not present before, typically these will
  represent database functions where you `@omit`'d the underlying table -
  omitting the table should not prevent a function from accessing it. Further,
  fix behavior of `@omit read` emulation to add
  `-connection -list -array -single`.

- [#2156](https://github.com/graphile/crystal/pull/2156)
  [`6fdc6cad8`](https://github.com/graphile/crystal/commit/6fdc6cad8f8d1230202df533d05cc2bd80538f09)
  Thanks [@benjie](https://github.com/benjie)! - Added `pgRegistry.pgExecutors`
  so executors don't need to be looked up from a resource (this causes
  confusion) - instead they can be referenced directly. By default there's one
  executor called `main`, i.e. `build.input.pgRegistry.pgExecutors.main`.

- [#2175](https://github.com/graphile/crystal/pull/2175)
  [`c69b2fdec`](https://github.com/graphile/crystal/commit/c69b2fdec2d73f1101440eb96fe126f9ad77db98)
  Thanks [@benjie](https://github.com/benjie)! - Fix 'Container is falsy' error
  message the latest Babel patch release would cause.

- [#2191](https://github.com/graphile/crystal/pull/2191)
  [`1eac03ec2`](https://github.com/graphile/crystal/commit/1eac03ec2e9da65c64b7754c04292f43da82c40b)
  Thanks [@benjie](https://github.com/benjie)! - Broaden types around
  `pgSelectSingleFromRecord`

- [#2158](https://github.com/graphile/crystal/pull/2158)
  [`dfac43992`](https://github.com/graphile/crystal/commit/dfac43992019b0b6c1d113d2490a87eb03d103d7)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Amber preset no longer
  enables backward pagination options (`before`, `last`) on functions by
  default - add `+backwards` behavior to these functions to enable. If you're
  using the V4 preset you should be unaffected by this change because it enables
  `+backwards` by default.

- [#2160](https://github.com/graphile/crystal/pull/2160)
  [`426e9320e`](https://github.com/graphile/crystal/commit/426e9320e76ef95927eebb6fe4072050b6208771)
  Thanks [@benjie](https://github.com/benjie)! - Massive overhaul of the
  behavior system which now has a centralized registry of known behaviors and
  applies behaviors in a more careful and nuanced way, removing many hacks and
  workarounds, and ultimately meaning that `defaultBehavior: "-*"` should now
  operate correctly. Importantly, `addBehaviorToTags()` has been removed - you
  should use `plugin.schema.entityBehaviors` to indicate behaviors as shown in
  this PR - do not mod the tags directly unless they're explicitly meant to be
  overrides.

  Technically this is a significant breaking change (besides the removal of the
  `addBehaviorToTags()` helper) because the order in which behaviors are applied
  has changed, and so a different behavior might ultimately "win". This shows up
  in places where there is ambiguity, for example if you add `@filterable` to a
  function that you don't have execute permissions on, that function will now
  show up in the schema since user overrides (smart tags) "win" versus inferred
  behaviors such as introspected permissions; this wasn't the case before.
  Hopefully most users will not notice any difference, and for those who do, the
  `graphile behavior debug` CLI may be able to help you figure out what's going
  on.

  Be sure to print your schema before and after this update and look for
  changes; if there are changes then you likely need to fix the relevant
  behaviors/smart tags. (Hopefully there's no changes for you!)

  You'll also need to change any places where you're specifying behaviors that
  will be type checked; you can either cast your existing strings e.g.
  `defaultBehavior: "+connection -list" as GraphileBuild.BehaviorString`, or
  preferably you can specify your behaviors as an array, which should give you
  auto-complete on each entry; e.g. `defaultBehavior: ["connection", "-list"]`.

- [#2188](https://github.com/graphile/crystal/pull/2188)
  [`282eb909f`](https://github.com/graphile/crystal/commit/282eb909f3e2dc74fb262714248d29056464fb1d)
  Thanks [@benjie](https://github.com/benjie)! - PostGraphile V4 preset now
  automatically includes the Amber preset on which it relies.

- [#2202](https://github.com/graphile/crystal/pull/2202)
  [`2efadc0f8`](https://github.com/graphile/crystal/commit/2efadc0f80c3a0c172fb94c770afecc5447e832b)
  Thanks [@benjie](https://github.com/benjie)! - Postgres v17 support

- [#2151](https://github.com/graphile/crystal/pull/2151)
  [`e8a9fd424`](https://github.com/graphile/crystal/commit/e8a9fd4243981b892364148eca1df66620ddeb87)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug preventing using
  certain steps as input to `resource.find({...})` and `resource.get({...})`.

- [#2188](https://github.com/graphile/crystal/pull/2188)
  [`cc0941731`](https://github.com/graphile/crystal/commit/cc0941731a1679bc04ce7b7fd4254009bb5f1f62)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul the way in which
  `graphile-config` presets work such that including a preset at two different
  layers shouldn't result in unexpected behavior.

- [#2157](https://github.com/graphile/crystal/pull/2157)
  [`50f6ce456`](https://github.com/graphile/crystal/commit/50f6ce456de3edd084869b54ee9f2eaf51a7fa0c)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 PostGraphile now ignores
  unlogged database tables by default.

- [#2190](https://github.com/graphile/crystal/pull/2190)
  [`b0865d169`](https://github.com/graphile/crystal/commit/b0865d1691105b5419009954c98c8109a27a5d81)
  Thanks [@benjie](https://github.com/benjie)! - Apply `assertNotAsync` and
  `assertNotPromise` in more places to detect plan resolvers returning promises.

- [#2199](https://github.com/graphile/crystal/pull/2199)
  [`3b09b414f`](https://github.com/graphile/crystal/commit/3b09b414ff43c34593373fa1f242481b0c7ada70)
  Thanks [@benjie](https://github.com/benjie)! - Database enum comments are now
  reflected in the schema.

- [#2196](https://github.com/graphile/crystal/pull/2196)
  [`b7b6dd64f`](https://github.com/graphile/crystal/commit/b7b6dd64fcc07f2ca15528fd39d61297d743dcc6)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 `@notNull` on a volatile
  function now results in the field on the payload becoming non-null, not the
  mutation field itself.

- [#2155](https://github.com/graphile/crystal/pull/2155)
  [`8b472cd51`](https://github.com/graphile/crystal/commit/8b472cd51cd66d8227f9f2722d09c0a774792b0f)
  Thanks [@benjie](https://github.com/benjie)! - `disablePlugins` now supports
  TypeScript auto-completion of known plugin names. Other names are still
  accepted without error, so this is just a minor DX improvement rather than
  type safety.

- [#2198](https://github.com/graphile/crystal/pull/2198)
  [`ba637b56d`](https://github.com/graphile/crystal/commit/ba637b56d79a14f82fe555739921724eab0c07f7)
  Thanks [@benjie](https://github.com/benjie)! - Ensure that interface subtypes
  are added to schema even if not referenced directly.
- Updated dependencies
  [[`d7e6e714f`](https://github.com/graphile/crystal/commit/d7e6e714f0cc5656112703484298b77538b2dccc),
  [`d5834def1`](https://github.com/graphile/crystal/commit/d5834def1fb84f3e2c0c0a6f146f8249a6df890a),
  [`bb006ec7b`](https://github.com/graphile/crystal/commit/bb006ec7bdab24192c84f093ce3f92969aeb7279),
  [`653929af0`](https://github.com/graphile/crystal/commit/653929af0a99a8a4d52b66e66c736be668b8700a),
  [`6fdc6cad8`](https://github.com/graphile/crystal/commit/6fdc6cad8f8d1230202df533d05cc2bd80538f09),
  [`42b982463`](https://github.com/graphile/crystal/commit/42b9824637a6c05e02935f2b05b5e8e0c61965a6),
  [`eb69c7361`](https://github.com/graphile/crystal/commit/eb69c7361fc7bf8c5b1ce342eeb698bd28c9e013),
  [`54054b873`](https://github.com/graphile/crystal/commit/54054b8733236ba7b2f2fa47d84e085f7196e3f9),
  [`884a4b429`](https://github.com/graphile/crystal/commit/884a4b4297af90fdadaf73addd524f1fbbcfdcce),
  [`0df171123`](https://github.com/graphile/crystal/commit/0df17112300a8ea391dfd220c5f05d362ceaa58a),
  [`1eac03ec2`](https://github.com/graphile/crystal/commit/1eac03ec2e9da65c64b7754c04292f43da82c40b),
  [`dfac43992`](https://github.com/graphile/crystal/commit/dfac43992019b0b6c1d113d2490a87eb03d103d7),
  [`38835313a`](https://github.com/graphile/crystal/commit/38835313ad93445206dccdd4cf07b90c5a6e4377),
  [`426e9320e`](https://github.com/graphile/crystal/commit/426e9320e76ef95927eebb6fe4072050b6208771),
  [`e8a9fd424`](https://github.com/graphile/crystal/commit/e8a9fd4243981b892364148eca1df66620ddeb87),
  [`cc0941731`](https://github.com/graphile/crystal/commit/cc0941731a1679bc04ce7b7fd4254009bb5f1f62),
  [`50f6ce456`](https://github.com/graphile/crystal/commit/50f6ce456de3edd084869b54ee9f2eaf51a7fa0c),
  [`b0865d169`](https://github.com/graphile/crystal/commit/b0865d1691105b5419009954c98c8109a27a5d81),
  [`3b09b414f`](https://github.com/graphile/crystal/commit/3b09b414ff43c34593373fa1f242481b0c7ada70),
  [`b7b6dd64f`](https://github.com/graphile/crystal/commit/b7b6dd64fcc07f2ca15528fd39d61297d743dcc6),
  [`8b472cd51`](https://github.com/graphile/crystal/commit/8b472cd51cd66d8227f9f2722d09c0a774792b0f),
  [`ba637b56d`](https://github.com/graphile/crystal/commit/ba637b56d79a14f82fe555739921724eab0c07f7),
  [`9cd9bb522`](https://github.com/graphile/crystal/commit/9cd9bb5222a9f0398ee4b8bfa4f741b6de2a2192)]:
  - graphile-build-pg@5.0.0-beta.29
  - grafast@0.1.1-beta.15
  - graphile-build@5.0.0-beta.25
  - @dataplan/pg@0.0.1-beta.26
  - graphile-config@0.0.1-beta.10
  - graphile-utils@5.0.0-beta.29
  - @dataplan/json@0.0.1-beta.24
  - grafserv@0.1.1-beta.17

## 5.0.0-beta.29

### Patch Changes

- [#2149](https://github.com/graphile/crystal/pull/2149)
  [`52ef49ca9`](https://github.com/graphile/crystal/commit/52ef49ca9357e63d0aa5c06ac089bf57ee991c73)
  Thanks [@benjie](https://github.com/benjie)! - Fixed a bug in 'relational'
  polymorphism where relations to each of the concrete types would
  non-sensically be added to each of the concrete types.
- Updated dependencies
  [[`52ef49ca9`](https://github.com/graphile/crystal/commit/52ef49ca9357e63d0aa5c06ac089bf57ee991c73),
  [`82ce02cd9`](https://github.com/graphile/crystal/commit/82ce02cd93df3df3c9570c3528483c4f720ff9bb),
  [`871d32b2a`](https://github.com/graphile/crystal/commit/871d32b2a18df0d257880fc54a61d9e68c4607d6),
  [`e8a0c4441`](https://github.com/graphile/crystal/commit/e8a0c4441cd04402974cd0af6b80816c9cda91e7),
  [`d9d07b97b`](https://github.com/graphile/crystal/commit/d9d07b97b41c928033b9a920931ae0ccccf88e82),
  [`a26e3a30c`](https://github.com/graphile/crystal/commit/a26e3a30c02f963f8f5e9c9d021e871f33689e1b),
  [`eca7e62e2`](https://github.com/graphile/crystal/commit/eca7e62e2a09af77f4f166a281dab81d009d9ec1),
  [`02c11a4d4`](https://github.com/graphile/crystal/commit/02c11a4d42bf434dffc9354b300e8d791c4eeb2d)]:
  - graphile-build-pg@5.0.0-beta.28
  - @dataplan/pg@0.0.1-beta.25
  - grafast@0.1.1-beta.14
  - graphile-build@5.0.0-beta.24
  - graphile-utils@5.0.0-beta.28
  - @dataplan/json@0.0.1-beta.23
  - grafserv@0.1.1-beta.16

## 5.0.0-beta.28

### Patch Changes

- Updated dependencies
  [[`807650035`](https://github.com/graphile/crystal/commit/8076500354a3e2bc2de1b6c4e947bd710cc5bddc)]:
  - @dataplan/pg@0.0.1-beta.24
  - grafast@0.1.1-beta.13
  - graphile-build-pg@5.0.0-beta.27
  - graphile-utils@5.0.0-beta.27
  - @dataplan/json@0.0.1-beta.22
  - grafserv@0.1.1-beta.15
  - graphile-build@5.0.0-beta.23

## 5.0.0-beta.27

### Patch Changes

- [#2129](https://github.com/graphile/crystal/pull/2129)
  [`1f67999eb`](https://github.com/graphile/crystal/commit/1f67999eb11435562ca76e8e7349aaadc28390f6)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in orderBy planning
  that caused a new plan to be required for every request.

- [#2121](https://github.com/graphile/crystal/pull/2121)
  [`8bdc553b7`](https://github.com/graphile/crystal/commit/8bdc553b79aae21a27d22a4e1f1e57ee2e5d1d3f)
  Thanks [@benjie](https://github.com/benjie)! - Add support for accepting
  poolConfig via makePgService

- [#2128](https://github.com/graphile/crystal/pull/2128)
  [`4e102b1a1`](https://github.com/graphile/crystal/commit/4e102b1a1cd232e6f6703df0706415f01831dab2)
  Thanks [@adamni21](https://github.com/adamni21)! - Reduce planning cost of
  large input object trees by evaluating keys up front (thanks to @adamni21).

- [#1985](https://github.com/graphile/crystal/pull/1985)
  [`d6102714e`](https://github.com/graphile/crystal/commit/d6102714e4fec35952784c988c1617c789eee0cd)
  Thanks [@hannesj](https://github.com/hannesj)! - 🚨 PostgreSQL adaptor is no
  longer loaded via string value; instead you must pass the adaptor instance
  directly. If you have `adaptor: "@dataplan/pg/adaptors/pg"` then replace it
  with `adaptor: await import("@dataplan/pg/adaptors/pg")`. (This shouldn't
  cause you issues because you _should_ be using `makePgService` to construct
  your `pgServices` rather than building raw objects.)

  🚨 If you've implemented a custom PgAdaptor, talk to Benjie about how to port
  it. (Should be straightforward, but no point me figuring it out if no-one has
  done it yet 🤷)

  This change improves bundle-ability by reducing the number of dynamic imports.

  Also: `PgAdaptorOptions` has been renamed to `PgAdaptorSettings`, so please do
  a global find and replace for that.

- [#2094](https://github.com/graphile/crystal/pull/2094)
  [`c0e50a1b4`](https://github.com/graphile/crystal/commit/c0e50a1b4f1c95bfcafb5458dce0d5e56852d7d0)
  Thanks [@benjie](https://github.com/benjie)! - makeWrapPlansPlugin more likely
  to be exportable.

- Updated dependencies
  [[`1f67999eb`](https://github.com/graphile/crystal/commit/1f67999eb11435562ca76e8e7349aaadc28390f6),
  [`1bd50b61e`](https://github.com/graphile/crystal/commit/1bd50b61ebb10b7d09b3612c2e2767c41cca3b78),
  [`8bdc553b7`](https://github.com/graphile/crystal/commit/8bdc553b79aae21a27d22a4e1f1e57ee2e5d1d3f),
  [`61f8bbca5`](https://github.com/graphile/crystal/commit/61f8bbca5badda5b27872e0ee01a2d4c1372210d),
  [`4e102b1a1`](https://github.com/graphile/crystal/commit/4e102b1a1cd232e6f6703df0706415f01831dab2),
  [`1cabbd311`](https://github.com/graphile/crystal/commit/1cabbd311bdefd7ce78f8dacbf61a42237a6c73c),
  [`7bb1573ba`](https://github.com/graphile/crystal/commit/7bb1573ba45a4d8b7fa9ad53cdd79686d2641383),
  [`590b6fdf5`](https://github.com/graphile/crystal/commit/590b6fdf5d04a392c4cc9e8bdad83278377c547b),
  [`18addb385`](https://github.com/graphile/crystal/commit/18addb3852525aa91019a36d58fa2fecd8b5b443),
  [`d6102714e`](https://github.com/graphile/crystal/commit/d6102714e4fec35952784c988c1617c789eee0cd),
  [`6ed615e55`](https://github.com/graphile/crystal/commit/6ed615e557b2ab1fb57f1e68c06730a8e3da7175),
  [`b25cc539c`](https://github.com/graphile/crystal/commit/b25cc539c00aeda7a943c37509aaae4dc7812317),
  [`867f33136`](https://github.com/graphile/crystal/commit/867f331365346fc46ed1e0d23c79719846e398f4),
  [`925123497`](https://github.com/graphile/crystal/commit/925123497cf17b5e145ab80f62fa9de768a977ae),
  [`cf535c210`](https://github.com/graphile/crystal/commit/cf535c21078da06c14dd12f30e9b4378da4ded03),
  [`c0e50a1b4`](https://github.com/graphile/crystal/commit/c0e50a1b4f1c95bfcafb5458dce0d5e56852d7d0),
  [`acf99b190`](https://github.com/graphile/crystal/commit/acf99b190954e3c5926e820daed68dfe8eb3ee1f),
  [`4967a197f`](https://github.com/graphile/crystal/commit/4967a197fd2c71ee2a581fe29470ee9f30e74de5),
  [`1908e1ba1`](https://github.com/graphile/crystal/commit/1908e1ba11883a34dac66f985fc20ab160e572b1),
  [`084d80be6`](https://github.com/graphile/crystal/commit/084d80be6e17187c9a9932bcf079e3f460368782),
  [`aa0474755`](https://github.com/graphile/crystal/commit/aa0474755142a758fc58c5c1a30b8c754bc84e7c)]:
  - graphile-build-pg@5.0.0-beta.26
  - grafast@0.1.1-beta.12
  - @dataplan/pg@0.0.1-beta.23
  - grafserv@0.1.1-beta.14
  - graphile-utils@5.0.0-beta.26
  - @dataplan/json@0.0.1-beta.21
  - graphile-build@5.0.0-beta.22

## 5.0.0-beta.26

### Patch Changes

- [#2071](https://github.com/graphile/crystal/pull/2071)
  [`582bd768f`](https://github.com/graphile/crystal/commit/582bd768fec403ce3284f293b85b9fd86e4d3f40)
  Thanks [@benjie](https://github.com/benjie)! - `GrafastExecutionArgs` now
  accepts `resolvedPreset` and `requestContext` directly; passing these through
  additional arguments is now deprecated and support will be removed in a future
  revision. This affects:

  - `grafast()`
  - `execute()`
  - `subscribe()`
  - `hookArgs()`

  `graphile-config` has gained a middleware system which is more powerful than
  it's AsyncHooks system. Old hooks can be emulated through the middleware
  system safely since middleware is a superset of hooks' capabilities.
  `applyHooks` has been renamed to `orderedApply` (because it applies to more
  than just hooks), calling `applyHooks` will still work but is deprecated.

  🚨 `grafast` no longer automatically reads your `graphile.config.ts` or
  similar; you must do that yourself and pass the `resolvedPreset` to grafast
  via the `args`. This is to aid in bundling of grafast since it should not need
  to read from filesystem or dynamically load modules.

  `grafast` no longer outputs performance warning when you set
  `GRAPHILE_ENV=development`.

  🚨 `plugin.grafast.hooks.args` is now `plugin.grafast.middleware.prepareArgs`,
  and the signature has changed - you must be sure to call the `next()` function
  and ctx/resolvedPreset can be extracted directly from `args`:

  ```diff
   const plugin = {
     grafast: {
  -    hooks: {
  +    middleware: {
  -      args({ args, ctx, resolvedPreset }) {
  +      prepareArgs(next, { args }) {
  +        const { requestContext: ctx, resolvedPreset } = args;
           // ...
  +        return next();
         }
       }
     }
   }
  ```

  Many more middleware have been added; use TypeScript's autocomplete to see
  what's available until we have proper documentation for them.

  `plugin.grafserv.hooks.*` are still supported but deprecated; instead use
  middleware `plugin.grafserv.middleware.*` (note that call signatures have
  changed slightly, similar to the diff above):

  - `hooks.init` -> `middleware.setPreset`
  - `hooks.processGraphQLRequestBody` -> `middleware.processGraphQLRequestBody`
  - `hooks.ruruHTMLParts` -> `middleware.ruruHTMLParts`

  A few TypeScript types related to Hooks have been renamed, but their old names
  are still available, just deprecated. They will be removed in a future update:

  - `HookObject` -> `FunctionalityObject`
  - `PluginHook` -> `CallbackOrDescriptor`
  - `PluginHookObject` -> `CallbackDescriptor`
  - `PluginHookCallback` -> `UnwrapCallback`

- Updated dependencies
  [[`582bd768f`](https://github.com/graphile/crystal/commit/582bd768fec403ce3284f293b85b9fd86e4d3f40)]:
  - graphile-build@5.0.0-beta.21
  - graphile-config@0.0.1-beta.9
  - @dataplan/pg@0.0.1-beta.22
  - grafserv@0.1.1-beta.13
  - grafast@0.1.1-beta.11
  - graphile-build-pg@5.0.0-beta.25
  - graphile-utils@5.0.0-beta.25
  - @dataplan/json@0.0.1-beta.20

## 5.0.0-beta.25

### Patch Changes

- Updated dependencies
  [[`3c161f7e1`](https://github.com/graphile/crystal/commit/3c161f7e13375105b1035a7d5d1c0f2b507ca5c7),
  [`a674a9923`](https://github.com/graphile/crystal/commit/a674a9923bc908c9315afa40e0cb256ee0953d16),
  [`b7cfeffd1`](https://github.com/graphile/crystal/commit/b7cfeffd1019d61c713a5054c4f5929960a2a6ab)]:
  - grafast@0.1.1-beta.10
  - @dataplan/json@0.0.1-beta.19
  - @dataplan/pg@0.0.1-beta.21
  - grafserv@0.1.1-beta.12
  - graphile-build@5.0.0-beta.20
  - graphile-build-pg@5.0.0-beta.24
  - graphile-utils@5.0.0-beta.24

## 5.0.0-beta.24

### Patch Changes

- [#2064](https://github.com/graphile/crystal/pull/2064)
  [`437570f97`](https://github.com/graphile/crystal/commit/437570f97e8520afaf3d0d0b514d1f4c31546b76)
  Thanks [@benjie](https://github.com/benjie)! - Fix a bug relating to Global
  Object Identifiers (specifically in update mutations, but probably elsewhere
  too) related to early exit.
- Updated dependencies
  [[`437570f97`](https://github.com/graphile/crystal/commit/437570f97e8520afaf3d0d0b514d1f4c31546b76)]:
  - graphile-build-pg@5.0.0-beta.23
  - grafast@0.1.1-beta.9
  - graphile-utils@5.0.0-beta.23
  - @dataplan/json@0.0.1-beta.18
  - @dataplan/pg@0.0.1-beta.20
  - grafserv@0.1.1-beta.11
  - graphile-build@5.0.0-beta.19

## 5.0.0-beta.23

### Patch Changes

- [#2056](https://github.com/graphile/crystal/pull/2056)
  [`1842af661`](https://github.com/graphile/crystal/commit/1842af661950d5f962b65f6362a45a3b9c8f15e8)
  Thanks [@benjie](https://github.com/benjie)! - Improve exporting of resource
  options (neater export code)

- Updated dependencies
  [[`1842af661`](https://github.com/graphile/crystal/commit/1842af661950d5f962b65f6362a45a3b9c8f15e8),
  [`bd5a908a4`](https://github.com/graphile/crystal/commit/bd5a908a4d04310f90dfb46ad87398ffa993af3b)]:
  - graphile-build-pg@5.0.0-beta.22
  - graphile-build@5.0.0-beta.18
  - grafast@0.1.1-beta.8
  - graphile-utils@5.0.0-beta.22
  - @dataplan/json@0.0.1-beta.17
  - @dataplan/pg@0.0.1-beta.19
  - grafserv@0.1.1-beta.10

## 5.0.0-beta.22

### Patch Changes

- [#2015](https://github.com/graphile/crystal/pull/2015)
  [`5eca6d65a`](https://github.com/graphile/crystal/commit/5eca6d65a816bac3d0ceaa6cafa7df1a79c2be47)
  Thanks [@benjie](https://github.com/benjie)! - Use `inhibitOnNull` when
  decoding a spec ID to prevent it being consumed if invalid (e.g. don't allow
  using a 'Post' node ID to fetch a 'Person' record).

- [#1994](https://github.com/graphile/crystal/pull/1994)
  [`ab08cbf9c`](https://github.com/graphile/crystal/commit/ab08cbf9c504c3cc22495a99a965e7634c18a6a3)
  Thanks [@benjie](https://github.com/benjie)! - Introduce
  `interface SQLable {[$toSQL](): SQL}` to `pg-sql2` and use it to simplify SQL
  fragments in various places.

- [#1978](https://github.com/graphile/crystal/pull/1978)
  [`a287a57c2`](https://github.com/graphile/crystal/commit/a287a57c2765da0fb6a132ea0953f64453210ceb)
  Thanks [@benjie](https://github.com/benjie)! - Breaking: `connection()` step
  now accepts configuration object in place of 2nd argument onwards:

  ```diff
  -return connection($list, nodePlan, cursorPlan);
  +return connection($list, { nodePlan, cursorPlan });
  ```

  Feature: `edgeDataPlan` can be specified as part of this configuration object,
  allowing you to associate edge data with your connection edges:

  ```ts
  return connection($list, {
    edgeDataPlan($item) {
      return object({ item: $item, otherThing: $otherThing });
    },
  });

  // ...

  const plans = {
    FooEdge: {
      otherThing($edge) {
        return $edge.data().get("otherThing");
      },
    },
  };
  ```

  Feature: `ConnectionStep` and `EdgeStep` gain `get()` methods, so
  `*Connection.edges`, `*Connection.nodes`, `*Connection.pageInfo`, `*Edge.node`
  and `*Edge.cursor` no longer need plans to be defined.

- [#2006](https://github.com/graphile/crystal/pull/2006)
  [`7ad35fe4d`](https://github.com/graphile/crystal/commit/7ad35fe4d9b20f6ec82dc95c362390a87e25b42c)
  Thanks [@benjie](https://github.com/benjie)! - When replacing inflectors via
  `plugin.inflection.replace.<inflector_name>` the first argument is the
  previous inflector (or null). Previously this was typed including the
  `this: Inflection` argument which meant to appease TypeScript you needed to do
  `previous.call(this, arg1, arg2)`, but this was never necessary in JS. This is
  now fixed, and you can now issue `previous(arg1, arg2)` from TypeScript
  without error.

- [#2050](https://github.com/graphile/crystal/pull/2050)
  [`272608c13`](https://github.com/graphile/crystal/commit/272608c135e4ef0f76b8b5a9f764494a3f3ad779)
  Thanks [@benjie](https://github.com/benjie)! - Add missing EXPORTABLE (and
  remove excessive EXPORTABLE) to fix schema exports.

- [#1995](https://github.com/graphile/crystal/pull/1995)
  [`e0d69e518`](https://github.com/graphile/crystal/commit/e0d69e518a98c70f9b90f59d243ce33978c1b5a1)
  Thanks [@benjie](https://github.com/benjie)! - Refactoring of unary logic.

- [#2048](https://github.com/graphile/crystal/pull/2048)
  [`db8ceed0f`](https://github.com/graphile/crystal/commit/db8ceed0f17923eb78ff09c9f3f28800a5c7e3b6)
  Thanks [@benjie](https://github.com/benjie)! - Help detect more invalid
  presets and plugins (bad imports) by forbidding keys starting with a capital
  or the key `default`.

- [#2046](https://github.com/graphile/crystal/pull/2046)
  [`966203504`](https://github.com/graphile/crystal/commit/96620350467ab8c65b56adf2f055e19450f8e772)
  Thanks [@benjie](https://github.com/benjie)! - Envelop peer dependency
  upgraded to V5

- [#1973](https://github.com/graphile/crystal/pull/1973)
  [`a0e82b9c5`](https://github.com/graphile/crystal/commit/a0e82b9c5f4e585f1af1e147299cd07944ece6f8)
  Thanks [@benjie](https://github.com/benjie)! - Add 'unary steps' concept to
  codebase and refactor to using new executeV2 execution method which leverages
  them. Backwards compatibility maintained, but users should move to executeV2.

- [#1989](https://github.com/graphile/crystal/pull/1989)
  [`c48d3da7f`](https://github.com/graphile/crystal/commit/c48d3da7fe4fac2562fab5f085d252a0bfb6f0b6)
  Thanks [@benjie](https://github.com/benjie)! - Make it so that more pgSelect
  queries optimize themselves into parent queries via new step.canAddDependency
  helper.

- [#2006](https://github.com/graphile/crystal/pull/2006)
  [`bee0a0a68`](https://github.com/graphile/crystal/commit/bee0a0a68d48816f84b1a7f5ec69bd6069211426)
  Thanks [@benjie](https://github.com/benjie)! - Adopt improved inflection
  typings.

- [#2019](https://github.com/graphile/crystal/pull/2019)
  [`51a94417f`](https://github.com/graphile/crystal/commit/51a94417fb62b54d309be184f4be479bc267c2b7)
  Thanks [@benjie](https://github.com/benjie)! - Now possible to filter by relay
  node identifiers without weird results if you pass an incompatible node id
  (e.g. a 'Post' ID where a 'User' ID was expected) - significantly improves the
  Relay preset.

- [#1988](https://github.com/graphile/crystal/pull/1988)
  [`81d17460c`](https://github.com/graphile/crystal/commit/81d17460ced08608814635779c5cf997c19c101d)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with record types
  when attributes need to be cast; this previously caused errors with computed
  columns when passed particular arguments.
- Updated dependencies
  [[`357d475f5`](https://github.com/graphile/crystal/commit/357d475f54fecc8c51892e0346d6872b34132430),
  [`30bcd6c12`](https://github.com/graphile/crystal/commit/30bcd6c12e59f878617ea987c35a2f589ce05cb8),
  [`3551725e7`](https://github.com/graphile/crystal/commit/3551725e71c3ed876554e19e5ab2c1dcb0fb1143),
  [`80836471e`](https://github.com/graphile/crystal/commit/80836471e5cedb29dee63bc5002550c4f1713cfd),
  [`b788dd868`](https://github.com/graphile/crystal/commit/b788dd86849e703cc3aa863fd9190c36a087b865),
  [`5eca6d65a`](https://github.com/graphile/crystal/commit/5eca6d65a816bac3d0ceaa6cafa7df1a79c2be47),
  [`a5c20fefb`](https://github.com/graphile/crystal/commit/a5c20fefb571dea6d1187515dc48dd547e9e6204),
  [`1ce08980e`](https://github.com/graphile/crystal/commit/1ce08980e2a52ed9bc81564d248c19648ecd3616),
  [`ab08cbf9c`](https://github.com/graphile/crystal/commit/ab08cbf9c504c3cc22495a99a965e7634c18a6a3),
  [`dff4f2535`](https://github.com/graphile/crystal/commit/dff4f2535ac6ce893089b312fcd5fffcd98573a5),
  [`a287a57c2`](https://github.com/graphile/crystal/commit/a287a57c2765da0fb6a132ea0953f64453210ceb),
  [`45e10950b`](https://github.com/graphile/crystal/commit/45e10950b533f97cdd986e5442e2e160a8e431a2),
  [`2fe56f9a6`](https://github.com/graphile/crystal/commit/2fe56f9a6dac03484ace45c29c2223a65f9ca1db),
  [`fed603d71`](https://github.com/graphile/crystal/commit/fed603d719c02f33e12190f925c9e3b06c581fac),
  [`ed6e0d278`](https://github.com/graphile/crystal/commit/ed6e0d2788217a1c419634837f4208013eaf2923),
  [`86168b740`](https://github.com/graphile/crystal/commit/86168b740510aef17bde7ae21f1d0eebb0c5c9b3),
  [`7ad35fe4d`](https://github.com/graphile/crystal/commit/7ad35fe4d9b20f6ec82dc95c362390a87e25b42c),
  [`e82e4911e`](https://github.com/graphile/crystal/commit/e82e4911e32138df1b90ec0fde555ea963018d21),
  [`94a05064e`](https://github.com/graphile/crystal/commit/94a05064ea05108685ff71174a9f871ab5b4c147),
  [`272608c13`](https://github.com/graphile/crystal/commit/272608c135e4ef0f76b8b5a9f764494a3f3ad779),
  [`42ece5aa6`](https://github.com/graphile/crystal/commit/42ece5aa6ca05345ebc17fb5c7d55df3b79b7612),
  [`e0d69e518`](https://github.com/graphile/crystal/commit/e0d69e518a98c70f9b90f59d243ce33978c1b5a1),
  [`e22cb4dfa`](https://github.com/graphile/crystal/commit/e22cb4dfa94b60d1b99c374e8c28943373bd8496),
  [`db8ceed0f`](https://github.com/graphile/crystal/commit/db8ceed0f17923eb78ff09c9f3f28800a5c7e3b6),
  [`a5a0816bd`](https://github.com/graphile/crystal/commit/a5a0816bddc85a841770202db57457ff13137852),
  [`6699388ec`](https://github.com/graphile/crystal/commit/6699388ec167d35c71220ce5d9113cac578da6cb),
  [`966203504`](https://github.com/graphile/crystal/commit/96620350467ab8c65b56adf2f055e19450f8e772),
  [`c1645b249`](https://github.com/graphile/crystal/commit/c1645b249aae949a548cd916e536ccfb63e5ab35),
  [`ed8bbaa3c`](https://github.com/graphile/crystal/commit/ed8bbaa3cd1563a7601ca8c6b0412633b0ea4ce9),
  [`a0e82b9c5`](https://github.com/graphile/crystal/commit/a0e82b9c5f4e585f1af1e147299cd07944ece6f8),
  [`14e2412ee`](https://github.com/graphile/crystal/commit/14e2412ee368e8d53abf6774c7f0069f32d4e8a3),
  [`c48d3da7f`](https://github.com/graphile/crystal/commit/c48d3da7fe4fac2562fab5f085d252a0bfb6f0b6),
  [`57ab0e1e7`](https://github.com/graphile/crystal/commit/57ab0e1e72c01213b21d3efc539cd655d83d993a),
  [`8442242e4`](https://github.com/graphile/crystal/commit/8442242e43cac7d89ca0c413cf42c9fabf6f247f),
  [`bee0a0a68`](https://github.com/graphile/crystal/commit/bee0a0a68d48816f84b1a7f5ec69bd6069211426),
  [`51a94417f`](https://github.com/graphile/crystal/commit/51a94417fb62b54d309be184f4be479bc267c2b7),
  [`64ce7b765`](https://github.com/graphile/crystal/commit/64ce7b7650530251aec38a51089da66f914c19b4),
  [`cba842357`](https://github.com/graphile/crystal/commit/cba84235786acbd77ade53bae7a3fba4a9be1eb7),
  [`2fa77d0f2`](https://github.com/graphile/crystal/commit/2fa77d0f237cdb98d3dafb6b5e4083a2c6c38673),
  [`81d17460c`](https://github.com/graphile/crystal/commit/81d17460ced08608814635779c5cf997c19c101d)]:
  - @dataplan/json@0.0.1-beta.16
  - @dataplan/pg@0.0.1-beta.18
  - grafast@0.1.1-beta.7
  - tamedevil@0.0.0-beta.7
  - graphile-build-pg@5.0.0-beta.21
  - pg-sql2@5.0.0-beta.6
  - graphile-build@5.0.0-beta.17
  - graphile-utils@5.0.0-beta.21
  - graphile-config@0.0.1-beta.8
  - grafserv@0.1.1-beta.9

## 5.0.0-beta.21

### Patch Changes

- [#1955](https://github.com/graphile/crystal/pull/1955)
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de)
  Thanks [@benjie](https://github.com/benjie)! - Steps are now prevented from
  calling other steps' lifecycle methods. GRAPHILE_ENV is actively encouraged,
  and falls back to NODE_ENV.

- [#1944](https://github.com/graphile/crystal/pull/1944)
  [`6c80c44b7`](https://github.com/graphile/crystal/commit/6c80c44b76a5eb30cc2b1555ba81a4b6236f4300)
  Thanks [@benjie](https://github.com/benjie)! - Fix accidental double-encoding
  of values on their way to postgres.

- [#1949](https://github.com/graphile/crystal/pull/1949)
  [`179d25b09`](https://github.com/graphile/crystal/commit/179d25b09bb3272eeef564067b8e512d8de0112f)
  Thanks [@benjie](https://github.com/benjie)! - Add support for registering
  PgCodecs via plugins, add support for ltree type, improve error messages, no
  longer need to set a gather namespace to use cache/state.

- [#1958](https://github.com/graphile/crystal/pull/1958)
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad)
  Thanks [@benjie](https://github.com/benjie)! - EXPORTABLE now accepts a third
  argument, `nameHint`, which is used to hint what variable name to use for the
  given value. Used this in `graphile-export` along with some fixes and
  optimizations to improve the exports further.

- [#1946](https://github.com/graphile/crystal/pull/1946)
  [`9d53dde72`](https://github.com/graphile/crystal/commit/9d53dde726b7304962e921b88a159649e49156e5)
  Thanks [@benjie](https://github.com/benjie)! - Exporting a schema now performs
  ESLint 'no-use-before-define' check to catch even more invalid export
  conditions. Fix `registerNodeIdCodec` calls caught by this.
- Updated dependencies
  [[`9f85c614d`](https://github.com/graphile/crystal/commit/9f85c614d48dc745c5fed15333dbb75af7fddc88),
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de),
  [`6c80c44b7`](https://github.com/graphile/crystal/commit/6c80c44b76a5eb30cc2b1555ba81a4b6236f4300),
  [`179d25b09`](https://github.com/graphile/crystal/commit/179d25b09bb3272eeef564067b8e512d8de0112f),
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad),
  [`9d53dde72`](https://github.com/graphile/crystal/commit/9d53dde726b7304962e921b88a159649e49156e5)]:
  - @dataplan/pg@0.0.1-beta.17
  - grafast@0.1.1-beta.6
  - graphile-build-pg@5.0.0-beta.20
  - graphile-build@5.0.0-beta.16
  - graphile-utils@5.0.0-beta.20
  - tamedevil@0.0.0-beta.6
  - @dataplan/json@0.0.1-beta.15
  - grafserv@0.1.1-beta.8

## 5.0.0-beta.20

### Patch Changes

- [#1927](https://github.com/graphile/crystal/pull/1927)
  [`00d32d887`](https://github.com/graphile/crystal/commit/00d32d887a6ae01374a4fda1babab7c8f14832c0)
  Thanks [@benjie](https://github.com/benjie)! - Excludes table constraints on
  tables from extensions if configured to not include extensions.

- [#1927](https://github.com/graphile/crystal/pull/1927)
  [`c62eee10b`](https://github.com/graphile/crystal/commit/c62eee10b445f9455bf2a0524ad2b828bdf4ffa6)
  Thanks [@benjie](https://github.com/benjie)! - Add pg_am to pg-introspection
  to enable determining index access method

- [#1934](https://github.com/graphile/crystal/pull/1934)
  [`9ac0ddc01`](https://github.com/graphile/crystal/commit/9ac0ddc014bfceb60b4b5641d6e8db605cc6a79b)
  Thanks [@benjie](https://github.com/benjie)! - Automatically detect when a
  `graphile-export` export is invalid, and throw an error indicating which
  method needs to have `EXPORTABLE` added around it.

- [#1931](https://github.com/graphile/crystal/pull/1931)
  [`941e28003`](https://github.com/graphile/crystal/commit/941e280038a735014a9fe4e24fc534a197fac0f2)
  Thanks [@benjie](https://github.com/benjie)! - Add support for deprecated
  arguments to Ruru.

- [#1935](https://github.com/graphile/crystal/pull/1935)
  [`8ea67f891`](https://github.com/graphile/crystal/commit/8ea67f8910693edaf70daa9952e35d8396166f38)
  Thanks [@benjie](https://github.com/benjie)! - Fix lots of things related to
  exporting a schema with `graphile-export`.

- [#1931](https://github.com/graphile/crystal/pull/1931)
  [`068be2f51`](https://github.com/graphile/crystal/commit/068be2f51d7a9c17311f26c6c9451985397c9e1f)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue typing into Ruru
  explorer plugin - characters no longer overwritten.

- [#1929](https://github.com/graphile/crystal/pull/1929)
  [`7587ca9e0`](https://github.com/graphile/crystal/commit/7587ca9e0f2bb93d0b22d1e2979d7b7912363600)
  Thanks [@benjie](https://github.com/benjie)! - PgLazyJWTPreset: return 401
  error when validation of JWT fails.

- [#1935](https://github.com/graphile/crystal/pull/1935)
  [`e20e66ed7`](https://github.com/graphile/crystal/commit/e20e66ed71b499ee5bbf05105f981809fd302212)
  Thanks [@benjie](https://github.com/benjie)! - Make even more of the schema
  exportable, including handling scalars with no parseLiteral definition.

- [#1931](https://github.com/graphile/crystal/pull/1931)
  [`ec3112c7b`](https://github.com/graphile/crystal/commit/ec3112c7b58d142b4b1d86cbb7de4ca80bbfda00)
  Thanks [@benjie](https://github.com/benjie)! - Add support for deprecating
  arguments to makeExtendSchemaPlugin

- Updated dependencies
  [[`49fd8afed`](https://github.com/graphile/crystal/commit/49fd8afed1afe573ea76a2a7a821dfa5d6288e2d),
  [`63dd7ea99`](https://github.com/graphile/crystal/commit/63dd7ea992d30ad711dd85a73a127484a0e35479),
  [`d801c9778`](https://github.com/graphile/crystal/commit/d801c9778a86d61e060896460af9fe62a733534a),
  [`c21252541`](https://github.com/graphile/crystal/commit/c212525410cb2d97a808964ad727d0a68dd15f8b),
  [`3a2ea80ee`](https://github.com/graphile/crystal/commit/3a2ea80ee470b2aef91366727d7d60a0c65067f5),
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195),
  [`8ea67f891`](https://github.com/graphile/crystal/commit/8ea67f8910693edaf70daa9952e35d8396166f38),
  [`5de3e86eb`](https://github.com/graphile/crystal/commit/5de3e86eba1ddfe5e07732d0325c63e5d72d4b5b),
  [`e20e66ed7`](https://github.com/graphile/crystal/commit/e20e66ed71b499ee5bbf05105f981809fd302212),
  [`ec3112c7b`](https://github.com/graphile/crystal/commit/ec3112c7b58d142b4b1d86cbb7de4ca80bbfda00)]:
  - tamedevil@0.0.0-beta.5
  - grafast@0.1.1-beta.5
  - grafserv@0.1.1-beta.7
  - graphile-build-pg@5.0.0-beta.19
  - graphile-build@5.0.0-beta.15
  - graphile-utils@5.0.0-beta.19
  - @dataplan/json@0.0.1-beta.14
  - @dataplan/pg@0.0.1-beta.16
  - pg-sql2@5.0.0-beta.5
  - graphile-config@0.0.1-beta.7

## 5.0.0-beta.19

### Patch Changes

- [#1895](https://github.com/graphile/crystal/pull/1895)
  [`555a2be03`](https://github.com/graphile/crystal/commit/555a2be037f49bd599abbaafe6e5d5ab190c96d6)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Fix issue with aggregates
  for polymorphic connections.

- [#1917](https://github.com/graphile/crystal/pull/1917)
  [`886833e2e`](https://github.com/graphile/crystal/commit/886833e2e319f23d905d7184ca88fca701b94044)
  Thanks [@benjie](https://github.com/benjie)! - Add `polymorphicBranch` step to
  core to help users deal with simple polymorphic use cases.

- [#1904](https://github.com/graphile/crystal/pull/1904)
  [`5b2db0c75`](https://github.com/graphile/crystal/commit/5b2db0c7586182523015f8f79fa4d43f98679c1e)
  Thanks [@benjie](https://github.com/benjie)! - Add pgRefDetails to scope for
  some ref-generated fields, to enable plugins to hook them.

- [#1920](https://github.com/graphile/crystal/pull/1920)
  [`635af159f`](https://github.com/graphile/crystal/commit/635af159fd412171030dbaee3a82b661c516a9f8)
  Thanks [@benjie](https://github.com/benjie)! - Add ability to set (and infer)
  scopes to makeExtendSchemaPlugin

- [#1905](https://github.com/graphile/crystal/pull/1905)
  [`184773382`](https://github.com/graphile/crystal/commit/184773382f074a3b5339e4cfabec55173cd4f1e1)
  Thanks [@benjie](https://github.com/benjie)! - Enable specifying the
  polymorphic subtype a function returns via `@returnType MyType` smart tag.

- [#1901](https://github.com/graphile/crystal/pull/1901)
  [`f97d7976a`](https://github.com/graphile/crystal/commit/f97d7976a683a1e2cb0fed1ce0e30aeff8cc1886)
  Thanks [@benjie](https://github.com/benjie)! - Loosens step assertion from
  Query type so it can be served from `constant(true)`.
- Updated dependencies
  [[`555a2be03`](https://github.com/graphile/crystal/commit/555a2be037f49bd599abbaafe6e5d5ab190c96d6),
  [`1b6c2f636`](https://github.com/graphile/crystal/commit/1b6c2f6360a316a8dc550c60e28c61deea538f19),
  [`de7add402`](https://github.com/graphile/crystal/commit/de7add402bd4a45c8782fce69bf210635360cbe8),
  [`a2176ea32`](https://github.com/graphile/crystal/commit/a2176ea324db0801249661b30e9c9d314c6fb159),
  [`886833e2e`](https://github.com/graphile/crystal/commit/886833e2e319f23d905d7184ca88fca701b94044),
  [`5b2db0c75`](https://github.com/graphile/crystal/commit/5b2db0c7586182523015f8f79fa4d43f98679c1e),
  [`635af159f`](https://github.com/graphile/crystal/commit/635af159fd412171030dbaee3a82b661c516a9f8),
  [`184773382`](https://github.com/graphile/crystal/commit/184773382f074a3b5339e4cfabec55173cd4f1e1),
  [`f97d7976a`](https://github.com/graphile/crystal/commit/f97d7976a683a1e2cb0fed1ce0e30aeff8cc1886)]:
  - @dataplan/pg@0.0.1-beta.15
  - tamedevil@0.0.0-beta.4
  - grafserv@0.1.1-beta.6
  - graphile-utils@5.0.0-beta.18
  - grafast@0.1.1-beta.4
  - graphile-build-pg@5.0.0-beta.18
  - graphile-build@5.0.0-beta.14
  - @dataplan/json@0.0.1-beta.13

## 5.0.0-beta.18

### Patch Changes

- [#1892](https://github.com/graphile/crystal/pull/1892)
  [`0df5511ac`](https://github.com/graphile/crystal/commit/0df5511ac8b79ea34f8d12ebf8feeb421f8fe971)
  Thanks [@benjie](https://github.com/benjie)! - Fix plugin ordering bug that
  ignored before/after when there was no provider; this now means
  PgSmartTagsPlugin is correctly loaded before PgFakeConstraintPlugin, fixing
  the `postgraphile.tags.json5` file.

- [#1894](https://github.com/graphile/crystal/pull/1894)
  [`7851d89ab`](https://github.com/graphile/crystal/commit/7851d89ab4216b0252583f0068a69900fa2ddc88)
  Thanks [@benjie](https://github.com/benjie)! - Fix logic around RBAC
  permissions for tables and sequences.

- Updated dependencies
  [[`0df5511ac`](https://github.com/graphile/crystal/commit/0df5511ac8b79ea34f8d12ebf8feeb421f8fe971)]:
  - graphile-config@0.0.1-beta.6
  - @dataplan/pg@0.0.1-beta.14
  - grafast@0.1.1-beta.3
  - grafserv@0.1.1-beta.5
  - graphile-build@5.0.0-beta.13
  - graphile-build-pg@5.0.0-beta.17
  - graphile-utils@5.0.0-beta.17
  - @dataplan/json@0.0.1-beta.12

## 5.0.0-beta.17

### Patch Changes

- [#1884](https://github.com/graphile/crystal/pull/1884)
  [`bce0636d4`](https://github.com/graphile/crystal/commit/bce0636d424476664672166193a181c83476423a)
  Thanks [@benjie](https://github.com/benjie)! - Fixes multiple pgServices codec
  name conflicts by prepending the service name if it's not 'main'.

- [#1867](https://github.com/graphile/crystal/pull/1867)
  [`004889258`](https://github.com/graphile/crystal/commit/004889258e22a19ffe9a641f57e4ddd5299db9bf)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in CLI parser where
  omitting `--watch` would force `watch: false` even if config sets
  `watch: true`.

- [#1817](https://github.com/graphile/crystal/pull/1817)
  [`f305c3278`](https://github.com/graphile/crystal/commit/f305c327848eb7baef46c5384a7cc5af6f79db8d)
  Thanks [@benjie](https://github.com/benjie)! - Add support for limiting
  polymorphic plans (only some of them, specifically `pgUnionAll()` right now)
  to limit the types of their results; exposed via an experimental 'only'
  argument on fields, for example
  `allApplications(only: [GcpApplication, AwsApplication])` would limit the type
  of applications returned to only be the two specified.

- [#1885](https://github.com/graphile/crystal/pull/1885)
  [`9e1df08b7`](https://github.com/graphile/crystal/commit/9e1df08b702ae32870a8f1324bab37f447cba868)
  Thanks [@benjie](https://github.com/benjie)! - Fix `orderBy:null` regression

- [#1878](https://github.com/graphile/crystal/pull/1878)
  [`e04238c0a`](https://github.com/graphile/crystal/commit/e04238c0aee46cc86ba61d6461b6636c2f9d1183)
  Thanks [@benjie](https://github.com/benjie)! - Add emulation for
  `--simple-subscriptions` to V4 preset.

- [#1884](https://github.com/graphile/crystal/pull/1884)
  [`c66c3527c`](https://github.com/graphile/crystal/commit/c66c3527ce2bb38afa37242ecb5a22247efd6db9)
  Thanks [@benjie](https://github.com/benjie)! - List codecs can now have names.

- Updated dependencies
  [[`3fdc2bce4`](https://github.com/graphile/crystal/commit/3fdc2bce42418773f808c5b8309dfb361cd95ce9),
  [`aeef362b5`](https://github.com/graphile/crystal/commit/aeef362b5744816f01e4a6f714bbd77f92332bc5),
  [`8a76db07f`](https://github.com/graphile/crystal/commit/8a76db07f4c110cecc6225504f9a05ccbcbc7b92),
  [`bce0636d4`](https://github.com/graphile/crystal/commit/bce0636d424476664672166193a181c83476423a),
  [`f305c3278`](https://github.com/graphile/crystal/commit/f305c327848eb7baef46c5384a7cc5af6f79db8d),
  [`3b558e0c1`](https://github.com/graphile/crystal/commit/3b558e0c110dd49e5d51e49a5ad6463a9ed68ecb),
  [`2ae8d33aa`](https://github.com/graphile/crystal/commit/2ae8d33aa83955649dcd6e7489604b059ed2daf4),
  [`9e1df08b7`](https://github.com/graphile/crystal/commit/9e1df08b702ae32870a8f1324bab37f447cba868),
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f),
  [`dbd91fdd8`](https://github.com/graphile/crystal/commit/dbd91fdd836f041b6e2ff9d358c6a6f521f43914),
  [`995e25035`](https://github.com/graphile/crystal/commit/995e250352217fdf8f036b8ed6cad3fab520817f),
  [`f1d5ad18e`](https://github.com/graphile/crystal/commit/f1d5ad18e1cd0d59b9e74f619ec6b0de57f07b17),
  [`c66c3527c`](https://github.com/graphile/crystal/commit/c66c3527ce2bb38afa37242ecb5a22247efd6db9),
  [`f66cc40b3`](https://github.com/graphile/crystal/commit/f66cc40b3bc5bf2e7f92fe5a6bd5638e2a51ac2b),
  [`f18635a5c`](https://github.com/graphile/crystal/commit/f18635a5cf55845c9534d82bb483e5fbb9ed179e),
  [`1c9f1c0ed`](https://github.com/graphile/crystal/commit/1c9f1c0edf4e621a5b6345d3a41527a18143c6ae),
  [`9fb5cc06e`](https://github.com/graphile/crystal/commit/9fb5cc06ee52165378392969172e6ee8128833f6)]:
  - grafast@0.1.1-beta.2
  - graphile-utils@5.0.0-beta.16
  - graphile-build-pg@5.0.0-beta.16
  - @dataplan/pg@0.0.1-beta.13
  - graphile-build@5.0.0-beta.12
  - graphile-config@0.0.1-beta.5
  - grafserv@0.1.1-beta.4
  - @dataplan/json@0.0.1-beta.11

## 5.0.0-beta.16

### Patch Changes

- [#1834](https://github.com/graphile/crystal/pull/1834)
  [`2e7fc6449`](https://github.com/graphile/crystal/commit/2e7fc6449c2d08c44c32985811bb2e233a04056b)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with watch mode where
  schema omits database resources in some situations.
- Updated dependencies
  [[`9696a1b08`](https://github.com/graphile/crystal/commit/9696a1b0885442f44e3a6ca6a4909ec96a445884),
  [`49fcb0d58`](https://github.com/graphile/crystal/commit/49fcb0d585b31b291c9072c339d6f5b550eefc9f),
  [`2e7fc6449`](https://github.com/graphile/crystal/commit/2e7fc6449c2d08c44c32985811bb2e233a04056b),
  [`7aef73319`](https://github.com/graphile/crystal/commit/7aef73319a8a147c700727be62427e1eefdefbf8)]:
  - grafserv@0.1.1-beta.3
  - grafast@0.1.1-beta.1
  - graphile-build-pg@5.0.0-beta.15
  - graphile-config@0.0.1-beta.4
  - @dataplan/pg@0.0.1-beta.12
  - @dataplan/json@0.0.1-beta.10
  - graphile-build@5.0.0-beta.11
  - graphile-utils@5.0.0-beta.15

## 5.0.0-beta.15

### Patch Changes

- [#1799](https://github.com/graphile/crystal/pull/1799)
  [`3dd5d86d6`](https://github.com/graphile/crystal/commit/3dd5d86d6c1ea7ba106c08e8a315ec47ed6cfa2d)
  Thanks [@jvandermey](https://github.com/jvandermey)! - Can now pass onEdit
  callbacks through the Ruru config via the plugin system; e.g. to update the
  URL search params with the current editor state.

- [#1801](https://github.com/graphile/crystal/pull/1801)
  [`2d447a6b4`](https://github.com/graphile/crystal/commit/2d447a6b45d7db2813bd957f412cd959e2185759)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug where the owner of a
  database object wasn't seen as having any privileges.
- Updated dependencies
  [[`2d447a6b4`](https://github.com/graphile/crystal/commit/2d447a6b45d7db2813bd957f412cd959e2185759)]:
  - graphile-build-pg@5.0.0-beta.14
  - graphile-utils@5.0.0-beta.14
  - grafserv@0.1.1-beta.2
  - @dataplan/pg@0.0.1-beta.11

## 5.0.0-beta.14

### Patch Changes

- [#1796](https://github.com/graphile/crystal/pull/1796)
  [`ebb0b817e`](https://github.com/graphile/crystal/commit/ebb0b817e3efe210445d3f3396ff4bc53ebab3e7)
  Thanks [@benjie](https://github.com/benjie)! - Can now set initial query and
  variables in Ruru via the plugin system; e.g. to set query/variables based on
  query string.

- [#1797](https://github.com/graphile/crystal/pull/1797)
  [`26e0bc726`](https://github.com/graphile/crystal/commit/26e0bc72653cd8dcef4b6cfb3c76876a5e620a12)
  Thanks [@benjie](https://github.com/benjie)! - Fix that smart tags were not
  copied onto enum codecs.

- Updated dependencies
  [[`781a89758`](https://github.com/graphile/crystal/commit/781a89758fff2712f0080d8fafb4048da189b782),
  [`a38e650d6`](https://github.com/graphile/crystal/commit/a38e650d67d6c7ff0cf5b853377622090ede3a50),
  [`26e0bc726`](https://github.com/graphile/crystal/commit/26e0bc72653cd8dcef4b6cfb3c76876a5e620a12)]:
  - grafserv@0.1.1-beta.1
  - graphile-build-pg@5.0.0-beta.13
  - @dataplan/pg@0.0.1-beta.11
  - graphile-utils@5.0.0-beta.13

## 5.0.0-beta.13

### Patch Changes

- Updated dependencies
  [[`2805edc68`](https://github.com/graphile/crystal/commit/2805edc68b90546bf71ffd293af4d87a79345825)]:
  - pg-sql2@5.0.0-beta.4
  - @dataplan/pg@0.0.1-beta.10
  - grafast@0.1.1-beta.0
  - graphile-build-pg@5.0.0-beta.12
  - graphile-utils@5.0.0-beta.12

## 5.0.0-beta.12

### Patch Changes

- [#1779](https://github.com/graphile/crystal/pull/1779)
  [`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8)
  Thanks [@benjie](https://github.com/benjie)! - Fix a polymorphic planning
  issue.

- [#1778](https://github.com/graphile/crystal/pull/1778)
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434)
  Thanks [@benjie](https://github.com/benjie)! - Enable source maps in modules
  where it was disabled.

- [#1780](https://github.com/graphile/crystal/pull/1780)
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3)
  Thanks [@benjie](https://github.com/benjie)! - Fix an issue with side effect
  plans and polymorphism

- [#1770](https://github.com/graphile/crystal/pull/1770)
  [`9a84bc6dd`](https://github.com/graphile/crystal/commit/9a84bc6dd5b33c1919f75f867df1f61c78686695)
  Thanks [@benjie](https://github.com/benjie)! - Fix issues around enum tables:
  indicate when an enum table codec replaces a regular attribute codec, expose
  helpers for working with enum tables, and don't exclude enum table references
  when using the Relay preset.

- [#1774](https://github.com/graphile/crystal/pull/1774)
  [`7d55d2c34`](https://github.com/graphile/crystal/commit/7d55d2c343880d7e665f9743f6ae7e39343c22cc)
  Thanks [@benjie](https://github.com/benjie)! - Add
  `preset.gather.pgIdentifiers` setting (values: 'qualified' or 'unqualified');
  if set to 'unqualified' then we will not add the schema name to table or
  function identifiers - it's up to you to ensure they're present in the
  `search_path` (which you can set via `pgSettings` on a per-request basis).
- Updated dependencies
  [[`eeccfd675`](https://github.com/graphile/crystal/commit/eeccfd67585a79330197886fdc98335562e08c0a),
  [`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8),
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434),
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3),
  [`9a84bc6dd`](https://github.com/graphile/crystal/commit/9a84bc6dd5b33c1919f75f867df1f61c78686695),
  [`b728d7fb9`](https://github.com/graphile/crystal/commit/b728d7fb91eb29fbb21d955af5fd9cb4278f6222),
  [`264158f03`](https://github.com/graphile/crystal/commit/264158f034e7b6ebc1a9a94d92b7e4fb746c5fac),
  [`2d31f058b`](https://github.com/graphile/crystal/commit/2d31f058b34d3f5ef11699582b9a4960a4ebc471),
  [`7d55d2c34`](https://github.com/graphile/crystal/commit/7d55d2c343880d7e665f9743f6ae7e39343c22cc)]:
  - graphile-utils@5.0.0-beta.11
  - grafast@0.1.1-beta.0
  - @dataplan/json@0.0.1-beta.9
  - @dataplan/pg@0.0.1-beta.9
  - graphile-build-pg@5.0.0-beta.11
  - graphile-build@5.0.0-beta.10
  - grafserv@0.1.1-beta.0

## 5.0.0-beta.11

### Patch Changes

- [#514](https://github.com/graphile/crystal-pre-merge/pull/514)
  [`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)
  Thanks [@benjie](https://github.com/benjie)! - Update package.json repository
  information

- Updated dependencies
  [[`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b),
  [`ede1092fe`](https://github.com/graphile/crystal-pre-merge/commit/ede1092fe197719b6fa786f4cfa75f6a1f4c56c1),
  [`566983fbd`](https://github.com/graphile/crystal-pre-merge/commit/566983fbd99c4b2df8c4ebd6260521670a2b7dfc),
  [`409bf6071`](https://github.com/graphile/crystal-pre-merge/commit/409bf607180d4d8faec658c803e5ec4d1a00c451)]:
  - graphile-build-pg@5.0.0-beta.10
  - graphile-build@5.0.0-beta.9
  - graphile-utils@5.0.0-beta.10
  - @dataplan/json@0.0.1-beta.8
  - graphile-config@0.0.1-beta.3
  - @dataplan/pg@0.0.1-beta.8
  - grafserv@0.0.1-beta.9
  - grafast@0.0.1-beta.8
  - tamedevil@0.0.0-beta.3
  - pg-sql2@5.0.0-beta.3
  - @graphile/lru@5.0.0-beta.3

## 5.0.0-beta.10

### Patch Changes

- Updated dependencies []:
  - grafserv@0.0.1-beta.8
  - graphile-build-pg@5.0.0-beta.9
  - @dataplan/pg@0.0.1-beta.7
  - graphile-utils@5.0.0-beta.9

## 5.0.0-beta.9

### Patch Changes

- Updated dependencies
  [[`3700e204f`](https://github.com/benjie/crystal/commit/3700e204f430db182c92ca7abc82017c81fa1f9b)]:
  - grafast@0.0.1-beta.7
  - @dataplan/json@0.0.1-beta.7
  - @dataplan/pg@0.0.1-beta.7
  - grafserv@0.0.1-beta.7
  - graphile-build@5.0.0-beta.8
  - graphile-build-pg@5.0.0-beta.9
  - graphile-utils@5.0.0-beta.9

## 5.0.0-beta.8

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`ac092e021`](https://github.com/benjie/crystal/commit/ac092e0217d1385967dcdf39c9c1a390ebf6add8)
  Thanks [@benjie](https://github.com/benjie)! - PostGraphile no longer exports
  `GraphileBuild` nor `GraphileConfig` - these are global namespaces.

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1),
  [`e613b476d`](https://github.com/benjie/crystal/commit/e613b476d6ee867d1f7509c895dabee40e7f9a31)]:
  - graphile-build-pg@5.0.0-beta.8
  - graphile-build@5.0.0-beta.7
  - graphile-utils@5.0.0-beta.8
  - @dataplan/json@0.0.1-beta.6
  - graphile-config@0.0.1-beta.2
  - @dataplan/pg@0.0.1-beta.6
  - grafserv@0.0.1-beta.6
  - grafast@0.0.1-beta.6
  - tamedevil@0.0.0-beta.2
  - pg-sql2@5.0.0-beta.2
  - @graphile/lru@5.0.0-beta.2

## 5.0.0-beta.7

### Patch Changes

- [#488](https://github.com/benjie/crystal/pull/488)
  [`e916b7412`](https://github.com/benjie/crystal/commit/e916b7412fc1fbbcb1578dbe07684189c2a720ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issues with polymorphism
  when interacting with nodeIds, particularly in mutations and SQL functions.
- Updated dependencies
  [[`95e902f54`](https://github.com/benjie/crystal/commit/95e902f5403c16895e874692f7650293d77590dd),
  [`53186213a`](https://github.com/benjie/crystal/commit/53186213ade962f4b66cb0d5ea8b57b5ce7ea85f),
  [`e916b7412`](https://github.com/benjie/crystal/commit/e916b7412fc1fbbcb1578dbe07684189c2a720ad),
  [`73f1b5218`](https://github.com/benjie/crystal/commit/73f1b52187b2e009d502afa1db8a4e8f702e2958),
  [`109c8ec67`](https://github.com/benjie/crystal/commit/109c8ec6784dc74f4c4c4c43cc61516cc12401c8)]:
  - @dataplan/pg@0.0.1-beta.5
  - grafast@0.0.1-beta.5
  - graphile-build-pg@5.0.0-beta.7
  - graphile-build@5.0.0-beta.6
  - grafserv@0.0.1-beta.5
  - @dataplan/json@0.0.1-beta.5
  - graphile-utils@5.0.0-beta.7

## 5.0.0-beta.6

### Patch Changes

- [#462](https://github.com/benjie/crystal/pull/462)
  [`53f0488b1`](https://github.com/benjie/crystal/commit/53f0488b1c060fe9f5dfcd67ad5c0bd932a4b7aa)
  Thanks [@benjie](https://github.com/benjie)! - Allow 'null' to be passed to
  `withPgClient`/`withPgClientTransaction`

- [#460](https://github.com/benjie/crystal/pull/460)
  [`07883a1a5`](https://github.com/benjie/crystal/commit/07883a1a5eac63bdc0541d6a2b562fc97342c439)
  Thanks [@benjie](https://github.com/benjie)! - Fix makeExtendSchemaPlugin: now
  calls callback in 'init' phase, so `Build` type is used (rather than
  `Partial<Build>`) and other types/handlers/etc should already be registered.

- [#463](https://github.com/benjie/crystal/pull/463)
  [`22fa6230a`](https://github.com/benjie/crystal/commit/22fa6230aa7c7271e5360e619ec9e1f52c6ea49c)
  Thanks [@benjie](https://github.com/benjie)! - Add experimental support for h3
  server to grafserv.

- [#459](https://github.com/benjie/crystal/pull/459)
  [`d17dd1cd4`](https://github.com/benjie/crystal/commit/d17dd1cd47d6cb125fbc84c38a8c004857e1bdd2)
  Thanks [@benjie](https://github.com/benjie)! - Disable mutations for
  `@interface mode:relational` tables. (They shouldn't have been enabled, and
  they don't work yet.)

- [#464](https://github.com/benjie/crystal/pull/464)
  [`00d026409`](https://github.com/benjie/crystal/commit/00d0264090f90914eac881b34918fa3370782adc)
  Thanks [@benjie](https://github.com/benjie)! - `@dataplan/pg/adaptors/pg` now
  adds `rawClient` property which is the underlying Postgres client for use with
  `pgTyped`, `zapatos`, and other libraries that can use a raw postgres client.
  This is exposed via `NodePostgresPgClient` interface which is a subtype of
  `PgClient`.
- Updated dependencies
  [[`53f0488b1`](https://github.com/benjie/crystal/commit/53f0488b1c060fe9f5dfcd67ad5c0bd932a4b7aa),
  [`f9cc88dc4`](https://github.com/benjie/crystal/commit/f9cc88dc442d371aee154a28d4e63c6da39f6b2e),
  [`07883a1a5`](https://github.com/benjie/crystal/commit/07883a1a5eac63bdc0541d6a2b562fc97342c439),
  [`22fa6230a`](https://github.com/benjie/crystal/commit/22fa6230aa7c7271e5360e619ec9e1f52c6ea49c),
  [`d17dd1cd4`](https://github.com/benjie/crystal/commit/d17dd1cd47d6cb125fbc84c38a8c004857e1bdd2),
  [`fa8cfcf9b`](https://github.com/benjie/crystal/commit/fa8cfcf9b4ce0c3e12511f3f6392051924a719e5),
  [`00d026409`](https://github.com/benjie/crystal/commit/00d0264090f90914eac881b34918fa3370782adc)]:
  - @dataplan/pg@0.0.1-beta.4
  - grafast@0.0.1-beta.4
  - graphile-utils@5.0.0-beta.6
  - grafserv@0.0.1-beta.4
  - graphile-build-pg@5.0.0-beta.6
  - @dataplan/json@0.0.1-beta.4
  - graphile-build@5.0.0-beta.5

## 5.0.0-beta.5

### Patch Changes

- Updated dependencies
  [[`22ecd1e5d`](https://github.com/benjie/crystal/commit/22ecd1e5de1dcd094be3085cba56b705446413f9)]:
  - graphile-build-pg@5.0.0-beta.5
  - graphile-utils@5.0.0-beta.5

## 5.0.0-beta.4

### Patch Changes

- [#454](https://github.com/benjie/crystal/pull/454)
  [`196e5c1aa`](https://github.com/benjie/crystal/commit/196e5c1aab52dbe2a069d0a15b9e4931523fd2dd)
  Thanks [@benjie](https://github.com/benjie)! -
  `@interface mode=single/relational` now get `Node` interface if the table has
  a PK.

  🚨 `@interface mode=union` no longer gets `Node` interface unless you also add
  `@behavior node`.

- [#454](https://github.com/benjie/crystal/pull/454)
  [`e75bf57dd`](https://github.com/benjie/crystal/commit/e75bf57ddb20d20c86dba880cbb1970ec6a875af)
  Thanks [@benjie](https://github.com/benjie)! - Automatically register
  connection types for unionMember unions.

- Updated dependencies
  [[`196e5c1aa`](https://github.com/benjie/crystal/commit/196e5c1aab52dbe2a069d0a15b9e4931523fd2dd),
  [`e75bf57dd`](https://github.com/benjie/crystal/commit/e75bf57ddb20d20c86dba880cbb1970ec6a875af)]:
  - graphile-build-pg@5.0.0-beta.4
  - graphile-build@5.0.0-beta.4
  - graphile-utils@5.0.0-beta.4
  - @dataplan/pg@0.0.1-beta.3

## 5.0.0-beta.3

### Patch Changes

- Updated dependencies
  [[`46cd08aa1`](https://github.com/benjie/crystal/commit/46cd08aa13e3bac4d186c72c6ce24997f37658af),
  [`d3ab4e12d`](https://github.com/benjie/crystal/commit/d3ab4e12d5bf0dc1c0364c603585175fa4d94d34)]:
  - grafast@0.0.1-beta.3
  - graphile-build-pg@5.0.0-beta.3
  - graphile-build@5.0.0-beta.3
  - @dataplan/pg@0.0.1-beta.3
  - @dataplan/json@0.0.1-beta.3
  - grafserv@0.0.1-beta.3
  - graphile-utils@5.0.0-beta.3

## 5.0.0-beta.2

### Patch Changes

- Updated dependencies
  [[`23bd3c291`](https://github.com/benjie/crystal/commit/23bd3c291246aebf27cf2784f40fc948485f43c9)]:
  - grafast@0.0.1-beta.2
  - @dataplan/json@0.0.1-beta.2
  - @dataplan/pg@0.0.1-beta.2
  - grafserv@0.0.1-beta.2
  - graphile-build@5.0.0-beta.2
  - graphile-build-pg@5.0.0-beta.2
  - graphile-utils@5.0.0-beta.2

## 5.0.0-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - @dataplan/json@0.0.1-beta.1
  - @dataplan/pg@0.0.1-beta.1
  - grafast@0.0.1-beta.1
  - grafserv@0.0.1-beta.1
  - graphile-build@5.0.0-beta.1
  - graphile-build-pg@5.0.0-beta.1
  - graphile-utils@5.0.0-beta.1
  - graphile-config@0.0.1-beta.1
  - @graphile/lru@5.0.0-beta.1
  - pg-sql2@5.0.0-beta.1
  - tamedevil@0.0.0-beta.1

## 5.0.0-alpha.20

### Patch Changes

- [#441](https://github.com/benjie/crystal/pull/441)
  [`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f)
  Thanks [@benjie](https://github.com/benjie)! - Change bundling techniques for
  grafast and @dataplan/pg

- [#441](https://github.com/benjie/crystal/pull/441)
  [`6c1c1a34f`](https://github.com/benjie/crystal/commit/6c1c1a34f674bf4ef3b13dadebb4e13c422c940e)
  Thanks [@benjie](https://github.com/benjie)! - Introduce \_allRows base
  inflector used by allRowsConnection and allRowsList

- Updated dependencies
  [[`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f),
  [`6c1c1a34f`](https://github.com/benjie/crystal/commit/6c1c1a34f674bf4ef3b13dadebb4e13c422c940e)]:
  - graphile-build-pg@5.0.0-alpha.20
  - @dataplan/pg@0.0.1-alpha.17
  - grafast@0.0.1-alpha.16
  - graphile-utils@5.0.0-alpha.20
  - @dataplan/json@0.0.1-alpha.16
  - grafserv@0.0.1-alpha.16
  - graphile-build@5.0.0-alpha.18

## 5.0.0-alpha.19

### Patch Changes

- [#433](https://github.com/benjie/crystal/pull/433)
  [`5491e10b0`](https://github.com/benjie/crystal/commit/5491e10b0f1629e607e7385985315169e156071d)
  Thanks [@benjie](https://github.com/benjie)! - Improve error messages from
  custom string scalars when they cannot be parsed as a string.

- [#434](https://github.com/benjie/crystal/pull/434)
  [`a9561d62d`](https://github.com/benjie/crystal/commit/a9561d62d54a6a1331d64b32e4cf3d162ad67a55)
  Thanks [@benjie](https://github.com/benjie)! - Deprecate
  `preset.gather.pgJwtType` (tuple), instead use `preset.gather.pgJwtTypes`
  which expects a string and parses it similar to the PostgreSQL parser (and
  also allows multiple types to be specified).

- [#433](https://github.com/benjie/crystal/pull/433)
  [`232885703`](https://github.com/benjie/crystal/commit/232885703dd577f71488fd1fc5a02e852a96d446)
  Thanks [@benjie](https://github.com/benjie)! - Change type of pgJwtSecret and
  pgJwtSignOptions from `any` to the correct types.

- [#438](https://github.com/benjie/crystal/pull/438)
  [`db19ed9c3`](https://github.com/benjie/crystal/commit/db19ed9c39f08b537f3bf316d1cf9bb39cee2603)
  Thanks [@benjie](https://github.com/benjie)! - When using
  `@interface mode:relational`, don't add pointless relationships from concrete
  type back to abstract or from abstract to related concrete types.

- [#438](https://github.com/benjie/crystal/pull/438)
  [`31e776e03`](https://github.com/benjie/crystal/commit/31e776e03ad0829e0ded52e32be789578dcf8d4f)
  Thanks [@benjie](https://github.com/benjie)! - Fix spurious error relating to
  connection for `@interface type:relational`

- [#436](https://github.com/benjie/crystal/pull/436)
  [`055c4e438`](https://github.com/benjie/crystal/commit/055c4e43888c007706db7079edd89d6def9b318d)
  Thanks [@benjie](https://github.com/benjie)! - Fix inflection of computed
  column field names in secondary schemas when using the V5 preset. Also, use
  underscores instead of dashes for the serviceName/schemaName separator for the
  names of the function resources, so that they can be typed manually rather
  than having to use string properties like
  `const { ["myService-mySchema-my_function_name"]: myFunctionResource } = pgRegistry.pgResources`

- [#435](https://github.com/benjie/crystal/pull/435)
  [`cf32f0397`](https://github.com/benjie/crystal/commit/cf32f0397f7a47509df9876112275f1ad135e8f2)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in listOfCodec causing
  wrong extensions to be used in non-deterministic manner (thanks to @jvandermey
  for finding the bug and helping to track it down).

- [#428](https://github.com/benjie/crystal/pull/428)
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug exporting schema, and
  importing schema with \_\_assertStep.

- [#438](https://github.com/benjie/crystal/pull/438)
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d)
  Thanks [@benjie](https://github.com/benjie)! - Plugin name now automatically
  used in `provides` for every hook, allowing ordering hooks before/after their
  equivalents in other plugins.

- [#422](https://github.com/benjie/crystal/pull/422)
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)
  Thanks [@benjie](https://github.com/benjie)! - Comments enabled in released
  packages

- [#428](https://github.com/benjie/crystal/pull/428)
  [`9695c65f8`](https://github.com/benjie/crystal/commit/9695c65f8dbad807de683a70f5f663af2d3b35f0)
  Thanks [@benjie](https://github.com/benjie)! - Optimize away some unnecessary
  content from graphile-exported schema

- [#428](https://github.com/benjie/crystal/pull/428)
  [`c00a21cb9`](https://github.com/benjie/crystal/commit/c00a21cb9e9dd80a8b69228746bd7973da21facc)
  Thanks [@benjie](https://github.com/benjie)! - Improve name and description of
  TagsFilePlugin

- [#433](https://github.com/benjie/crystal/pull/433)
  [`a5f224295`](https://github.com/benjie/crystal/commit/a5f22429501f9e13f0490d25500ca7a8403babc7)
  Thanks [@benjie](https://github.com/benjie)! - Add
  `postgraphile/presets/lazy-jwt` to handle boilerplate of JWT setup if the user
  doesn't want to do it themselves.
- Updated dependencies
  [[`ea003ca3a`](https://github.com/benjie/crystal/commit/ea003ca3a8f68fb87dca603582e47981ed033996),
  [`5491e10b0`](https://github.com/benjie/crystal/commit/5491e10b0f1629e607e7385985315169e156071d),
  [`a9561d62d`](https://github.com/benjie/crystal/commit/a9561d62d54a6a1331d64b32e4cf3d162ad67a55),
  [`232885703`](https://github.com/benjie/crystal/commit/232885703dd577f71488fd1fc5a02e852a96d446),
  [`db19ed9c3`](https://github.com/benjie/crystal/commit/db19ed9c39f08b537f3bf316d1cf9bb39cee2603),
  [`31e776e03`](https://github.com/benjie/crystal/commit/31e776e03ad0829e0ded52e32be789578dcf8d4f),
  [`055c4e438`](https://github.com/benjie/crystal/commit/055c4e43888c007706db7079edd89d6def9b318d),
  [`cf32f0397`](https://github.com/benjie/crystal/commit/cf32f0397f7a47509df9876112275f1ad135e8f2),
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b),
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d),
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5),
  [`9695c65f8`](https://github.com/benjie/crystal/commit/9695c65f8dbad807de683a70f5f663af2d3b35f0),
  [`c00a21cb9`](https://github.com/benjie/crystal/commit/c00a21cb9e9dd80a8b69228746bd7973da21facc)]:
  - grafast@0.0.1-alpha.15
  - graphile-build-pg@5.0.0-alpha.19
  - graphile-build@5.0.0-alpha.17
  - @dataplan/pg@0.0.1-alpha.16
  - graphile-config@0.0.1-alpha.7
  - @dataplan/json@0.0.1-alpha.15
  - grafserv@0.0.1-alpha.15
  - graphile-utils@5.0.0-alpha.19

## 5.0.0-alpha.18

### Patch Changes

- [#421](https://github.com/benjie/crystal/pull/421)
  [`415f436a0`](https://github.com/benjie/crystal/commit/415f436a04d42ba7d7a51457f99e8d8e6baee051)
  Thanks [@benjie](https://github.com/benjie)! - `@notNull` is now respected in
  PgAttributesPlugin for outputs as well as inputs.

- [#421](https://github.com/benjie/crystal/pull/421)
  [`5b8e46a8a`](https://github.com/benjie/crystal/commit/5b8e46a8a868d68290d0f274934593a23b5bb25e)
  Thanks [@benjie](https://github.com/benjie)! - Breaking for types: move
  `Pg*Tags` to `GraphileBuild.Pg*Tags` for easier declaration merging

- [#421](https://github.com/benjie/crystal/pull/421)
  [`bb64c090d`](https://github.com/benjie/crystal/commit/bb64c090d1094875ec51a8577a000cb4f796e197)
  Thanks [@benjie](https://github.com/benjie)! - New `build.pgResolveOutputType`
  helper exported to aid plugins determining GraphQL output type from a codec
  (taken from PgAttributesPlugin).
- Updated dependencies
  [[`415f436a0`](https://github.com/benjie/crystal/commit/415f436a04d42ba7d7a51457f99e8d8e6baee051),
  [`5b8e46a8a`](https://github.com/benjie/crystal/commit/5b8e46a8a868d68290d0f274934593a23b5bb25e),
  [`bb64c090d`](https://github.com/benjie/crystal/commit/bb64c090d1094875ec51a8577a000cb4f796e197)]:
  - graphile-build-pg@5.0.0-alpha.18
  - graphile-utils@5.0.0-alpha.18

## 5.0.0-alpha.17

### Patch Changes

- [#420](https://github.com/benjie/crystal/pull/420)
  [`c1518fad0`](https://github.com/benjie/crystal/commit/c1518fad093dc53c033866541f378878aab69b5c)
  Thanks [@benjie](https://github.com/benjie)! - Fix schema so it can run
  without NodePlugin

- Updated dependencies
  [[`c1518fad0`](https://github.com/benjie/crystal/commit/c1518fad093dc53c033866541f378878aab69b5c)]:
  - graphile-build-pg@5.0.0-alpha.17
  - graphile-build@5.0.0-alpha.16
  - graphile-utils@5.0.0-alpha.17

## 5.0.0-alpha.16

### Patch Changes

- Updated dependencies
  [[`d99d666fb`](https://github.com/benjie/crystal/commit/d99d666fb234eb02dd196610995fa480c596242a)]:
  - grafast@0.0.1-alpha.14
  - @dataplan/json@0.0.1-alpha.14
  - @dataplan/pg@0.0.1-alpha.15
  - grafserv@0.0.1-alpha.14
  - graphile-build@5.0.0-alpha.15
  - graphile-build-pg@5.0.0-alpha.16
  - graphile-utils@5.0.0-alpha.16

## 5.0.0-alpha.15

### Patch Changes

- [#417](https://github.com/benjie/crystal/pull/417)
  [`e7dd2e039`](https://github.com/benjie/crystal/commit/e7dd2e039769958d59a83ec3b164cad063c82500)
  Thanks [@benjie](https://github.com/benjie)! - `codec` is now baked into
  NodeId handlers (rather than using `codecName` and looking that up in
  `codecs`). All related APIs have thus simplified, e.g. the step
  `node(codecs, handler, $id)` is now `node(handler, $id)`, etc. TypeScript
  should point out any issues you have hopefully.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`620f9e07e`](https://github.com/benjie/crystal/commit/620f9e07ec6f4d66a8dc01ed6bb054a75f7b1c8b)
  Thanks [@benjie](https://github.com/benjie)! - Grafast now supports
  `operationsCacheMaxLength` and `operationOperationPlansCacheMaxLength`
  configuration via `schema.extensions.grafast.*`. Currently undocumented.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`881672305`](https://github.com/benjie/crystal/commit/88167230578393e3b24a364f0d673e36c5cb088d)
  Thanks [@benjie](https://github.com/benjie)! - `deepEval` has been renamed to
  `applyTransforms`

- [#418](https://github.com/benjie/crystal/pull/418)
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul peerDependencies and
  dependencies to try and eliminate duplicate modules error.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`ff4395bfc`](https://github.com/benjie/crystal/commit/ff4395bfc6e6b2fb263f644dae1e984c52dd84b9)
  Thanks [@benjie](https://github.com/benjie)! - Grafast operation cache now
  tied to the schema, so multiple schemas will not cause degraded performance
  from clearing the cache.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`502b23340`](https://github.com/benjie/crystal/commit/502b233401975637bc0d516af78721b37f6f9b7b)
  Thanks [@benjie](https://github.com/benjie)! - `preset.grafast.context` second
  parameter is no longer the existing GraphQL context, but instead the GraphQL
  request details (which contains the `contextValue`). If you were using this
  (unlikely), add `.contextValue` to usage of the second argument.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`dc94b4a30`](https://github.com/benjie/crystal/commit/dc94b4a3003a2fbe1d76e17bb519092fa134243a)
  Thanks [@benjie](https://github.com/benjie)! - Rename
  'postgraphilePresetAmber' to 'PostGraphileAmberPreset'

- [#410](https://github.com/benjie/crystal/pull/410)
  [`4eda0cd57`](https://github.com/benjie/crystal/commit/4eda0cd572274febad696ebb5a89472a981f8212)
  Thanks [@benjie](https://github.com/benjie)! - Use a single behavior check per
  location.

  In the past two weeks I added a few behavior strings like
  `array:attribute:filterBy` (a scoped form of `attribute:filterBy` to only be
  used by attributes that were arrays); however I've realised that this will
  require plugin authors to implement all the same logic to figure out what type
  an attribute is in order to then see if it has the relevant behavior. This
  goes against the design of the behavior system, and makes plugin authors'
  lives harder. So I've reverted this, and instead used the `entityBehaviors`
  system to add or remove the base `attribute:filterBy` (etc) behavior depending
  on what the type of the attribute is.

- Updated dependencies
  [[`e7dd2e039`](https://github.com/benjie/crystal/commit/e7dd2e039769958d59a83ec3b164cad063c82500),
  [`620f9e07e`](https://github.com/benjie/crystal/commit/620f9e07ec6f4d66a8dc01ed6bb054a75f7b1c8b),
  [`f115b6fb2`](https://github.com/benjie/crystal/commit/f115b6fb2338212688ccdbc3aeef77416058a2f7),
  [`1882e0185`](https://github.com/benjie/crystal/commit/1882e018576adf69bcae8a999224cb4d5e62a3e1),
  [`881672305`](https://github.com/benjie/crystal/commit/88167230578393e3b24a364f0d673e36c5cb088d),
  [`e5012f9a1`](https://github.com/benjie/crystal/commit/e5012f9a1901af63e1703ea4d717e8a22544f5e7),
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de),
  [`47f6f018b`](https://github.com/benjie/crystal/commit/47f6f018b11761cbfaa63d709edc0e3f4f9a9924),
  [`ff4395bfc`](https://github.com/benjie/crystal/commit/ff4395bfc6e6b2fb263f644dae1e984c52dd84b9),
  [`502b23340`](https://github.com/benjie/crystal/commit/502b233401975637bc0d516af78721b37f6f9b7b),
  [`4eda0cd57`](https://github.com/benjie/crystal/commit/4eda0cd572274febad696ebb5a89472a981f8212)]:
  - graphile-build-pg@5.0.0-alpha.15
  - graphile-build@5.0.0-alpha.14
  - grafast@0.0.1-alpha.13
  - @dataplan/pg@0.0.1-alpha.14
  - graphile-utils@5.0.0-alpha.15
  - @dataplan/json@0.0.1-alpha.13
  - grafserv@0.0.1-alpha.13

## 5.0.0-alpha.14

### Patch Changes

- [#406](https://github.com/benjie/crystal/pull/406)
  [`bfe5997e3`](https://github.com/benjie/crystal/commit/bfe5997e365fae9561133f6cd8126e986860b8c2)
  Thanks [@benjie](https://github.com/benjie)! - Ability to control via
  behaviors whether the record type is selectable on CRUD mutation payloads.

- [#407](https://github.com/benjie/crystal/pull/407)
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478)
  Thanks [@benjie](https://github.com/benjie)! - Exported `version` no longer
  uses `require('../package.json')` hack, instead the version number is written
  to a source file at versioning time. Packages now export `version`.

- [#406](https://github.com/benjie/crystal/pull/406)
  [`903c04b3b`](https://github.com/benjie/crystal/commit/903c04b3b866b4b9136ba6f8ba22dfd7aae8b7b5)
  Thanks [@benjie](https://github.com/benjie)! - Add `filterBy` and `orderBy`
  behaviors for each codec type (array, range, composite, binary, scalar) to
  allow simpler global customization.

- [#406](https://github.com/benjie/crystal/pull/406)
  [`c5eceba07`](https://github.com/benjie/crystal/commit/c5eceba07d0ca2ec93c058e2fcaf9fdf1b7b32e0)
  Thanks [@benjie](https://github.com/benjie)! - Incorrect ordering of behaviors
  `orderBy:array`/`orderBy:range` fixed ->
  `array:attribute:orderBy`/`range:attribute:orderBy`.

- [#407](https://github.com/benjie/crystal/pull/407)
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478)
  Thanks [@benjie](https://github.com/benjie)! - More accurate database
  identifier parser used in a couple places.

- [#407](https://github.com/benjie/crystal/pull/407)
  [`808af8af3`](https://github.com/benjie/crystal/commit/808af8af3fcc0d20154845a6b9962a094153d899)
  Thanks [@benjie](https://github.com/benjie)! - Allow marking relations as
  `@notNull`

- [#406](https://github.com/benjie/crystal/pull/406)
  [`9f5a784c6`](https://github.com/benjie/crystal/commit/9f5a784c601b67dfb2cbf7bd836d7aa060fba63c)
  Thanks [@benjie](https://github.com/benjie)! - Introduce TypeScript CIF
  gatherConfig() to help typing the `gather` phase for plugins.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`2849cc3fb`](https://github.com/benjie/crystal/commit/2849cc3fb8e4302b57cdf21f8c9a5fea33b797f8)
  Thanks [@benjie](https://github.com/benjie)! - Better handle the situation
  where a node fetcher could not be found.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`8ca9425ed`](https://github.com/benjie/crystal/commit/8ca9425edec68fbac0e727bd3d2754bf4843cc74)
  Thanks [@benjie](https://github.com/benjie)! - Detect when your preset doesn't
  have any plugins, or omits the QueryPlugin, and raise an error or warning
  indicating to the user that there's likely an issue here.

- [#406](https://github.com/benjie/crystal/pull/406)
  [`51414d328`](https://github.com/benjie/crystal/commit/51414d3281f04c8fd450d6364960336b862a5795)
  Thanks [@benjie](https://github.com/benjie)! - Add support for `bytea`
  datatype using new `Base64EncodedBinary` scalar in GraphQL.

- [#407](https://github.com/benjie/crystal/pull/407)
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478)
  Thanks [@benjie](https://github.com/benjie)! - Possible to set the modifier of
  an argument type via `@arg0modifier` smart tag

- [#408](https://github.com/benjie/crystal/pull/408)
  [`bc14d488d`](https://github.com/benjie/crystal/commit/bc14d488d5385f350b6d377716e43c46a405dc57)
  Thanks [@benjie](https://github.com/benjie)! - When sorting, specify a
  concrete locale to localeCompare to ensure stable ordering across machines.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`dda361d11`](https://github.com/benjie/crystal/commit/dda361d11c4d2625c5770df32843f3ec1407c922)
  Thanks [@benjie](https://github.com/benjie)! - Improve error messages for
  getInputTypeByName and getOutputTypeByName.

- Updated dependencies
  [[`f5dd38aa3`](https://github.com/benjie/crystal/commit/f5dd38aa34c10f5ef0e0fa8fa48b70534ac3c294),
  [`bfe5997e3`](https://github.com/benjie/crystal/commit/bfe5997e365fae9561133f6cd8126e986860b8c2),
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`903c04b3b`](https://github.com/benjie/crystal/commit/903c04b3b866b4b9136ba6f8ba22dfd7aae8b7b5),
  [`c5eceba07`](https://github.com/benjie/crystal/commit/c5eceba07d0ca2ec93c058e2fcaf9fdf1b7b32e0),
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999),
  [`c5050dd28`](https://github.com/benjie/crystal/commit/c5050dd286bd6d9fa4a5d9cfbf87ba609cb148dd),
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`808af8af3`](https://github.com/benjie/crystal/commit/808af8af3fcc0d20154845a6b9962a094153d899),
  [`9f5a784c6`](https://github.com/benjie/crystal/commit/9f5a784c601b67dfb2cbf7bd836d7aa060fba63c),
  [`2849cc3fb`](https://github.com/benjie/crystal/commit/2849cc3fb8e4302b57cdf21f8c9a5fea33b797f8),
  [`8ca9425ed`](https://github.com/benjie/crystal/commit/8ca9425edec68fbac0e727bd3d2754bf4843cc74),
  [`51414d328`](https://github.com/benjie/crystal/commit/51414d3281f04c8fd450d6364960336b862a5795),
  [`a298fc893`](https://github.com/benjie/crystal/commit/a298fc8931f3a0579fb6846d63b52fa3fcc6e65e),
  [`1300a9753`](https://github.com/benjie/crystal/commit/1300a975394f4e22540019bb0d40ba0bb9bec550),
  [`088d83b1d`](https://github.com/benjie/crystal/commit/088d83b1de2782a1a37a5998747b202a6c2b27a2),
  [`0d1782869`](https://github.com/benjie/crystal/commit/0d1782869adc76f5bbcecfdcbb85a258c468ca37),
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`bc14d488d`](https://github.com/benjie/crystal/commit/bc14d488d5385f350b6d377716e43c46a405dc57),
  [`dda361d11`](https://github.com/benjie/crystal/commit/dda361d11c4d2625c5770df32843f3ec1407c922)]:
  - tamedevil@0.0.0-alpha.4
  - graphile-build-pg@5.0.0-alpha.14
  - grafast@0.0.1-alpha.12
  - graphile-build@5.0.0-alpha.13
  - @dataplan/pg@0.0.1-alpha.13
  - graphile-config@0.0.1-alpha.6
  - pg-introspection@0.0.1-alpha.4
  - @dataplan/json@0.0.1-alpha.12
  - grafserv@0.0.1-alpha.12
  - ruru@2.0.0-alpha.9

## 5.0.0-alpha.13

### Patch Changes

- [#402](https://github.com/benjie/crystal/pull/402)
  [`70b2c3900`](https://github.com/benjie/crystal/commit/70b2c3900cd29d241e968fc81d6279848fafb9ae)
  Thanks [@benjie](https://github.com/benjie)! - pgCodecAttribute behavior now
  uses attributeName rather than attribute spec in the callback (BREAKING)

- [#402](https://github.com/benjie/crystal/pull/402)
  [`37d829b89`](https://github.com/benjie/crystal/commit/37d829b8912fb3d2b7e1aa99d2314444d136971d)
  Thanks [@benjie](https://github.com/benjie)! - Ability to control whether the
  nodeId or regular column CRUD mutations are used

- [#402](https://github.com/benjie/crystal/pull/402)
  [`ff91a5660`](https://github.com/benjie/crystal/commit/ff91a5660c5a33ab32555ab3da12f880179d9892)
  Thanks [@benjie](https://github.com/benjie)! - Added
  `postgraphile/presets/relay` preset:

  - Hides primary key columns from output schema, and includes `id: ID` instead
  - Hides foreign key columns from output schema, expecting you to use the
    relation instead
  - Hides columns that are part of the primary key from update/delete mutations
    (but still present for create if the column is writeable - it shouldn't be)
  - Hides columns that are part of a foreign key from CRUD mutations/filters,
    instead exposes the `ID` for the remote side of the relation
  - Does not allow ordering by individual primary key columns (though you can
    still order by `PRIMARY_KEY_ASC`/`DESC`)
  - Does not allow ordering by individual foreign key columns
  - Turns off the row fetchers that don't use the node `ID`
  - Turns off the CRUD mutations that don't use the node `ID`
  - Functions can now use `@arg0variant nodeId` to indicate the first argument
    (increase the `0` for other arguments) should accept a node `ID` (this
    currently only works where the argument type is a table type)
  - Removes relations from mutation payloads, these should be traversed via the
    record instead (they're redundant)

  Most of these changes are reversible, so for example if you really want to
  turn back on `Query.userByUsername` you can do so by adding the `+connection`
  behavior to the "unique username" constraint on the `users` table.

- [#402](https://github.com/benjie/crystal/pull/402)
  [`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)
  Thanks [@benjie](https://github.com/benjie)! - Use `file://` URLs in import()
  to fix compatibility with Windows (e.g. when loading `graphile.config.mjs`)

- [#402](https://github.com/benjie/crystal/pull/402)
  [`47365f0df`](https://github.com/benjie/crystal/commit/47365f0df2644fd91839a6698998e1463df8de79)
  Thanks [@benjie](https://github.com/benjie)! - Add helper for more easily
  handling NodeIDs for known typeName.

- [#402](https://github.com/benjie/crystal/pull/402)
  [`339cb005e`](https://github.com/benjie/crystal/commit/339cb005ed91aa8d421cdacd934877aee32e3f23)
  Thanks [@benjie](https://github.com/benjie)! - Remove relations from mutation
  payloads (unless using V4 preset) - they're redundant.
- Updated dependencies
  [[`70b2c3900`](https://github.com/benjie/crystal/commit/70b2c3900cd29d241e968fc81d6279848fafb9ae),
  [`37d829b89`](https://github.com/benjie/crystal/commit/37d829b8912fb3d2b7e1aa99d2314444d136971d),
  [`ff91a5660`](https://github.com/benjie/crystal/commit/ff91a5660c5a33ab32555ab3da12f880179d9892),
  [`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714),
  [`47365f0df`](https://github.com/benjie/crystal/commit/47365f0df2644fd91839a6698998e1463df8de79),
  [`339cb005e`](https://github.com/benjie/crystal/commit/339cb005ed91aa8d421cdacd934877aee32e3f23)]:
  - graphile-build-pg@5.0.0-alpha.13
  - graphile-build@5.0.0-alpha.12
  - graphile-config@0.0.1-alpha.5
  - @dataplan/pg@0.0.1-alpha.12
  - grafast@0.0.1-alpha.11
  - grafserv@0.0.1-alpha.11
  - ruru@2.0.0-alpha.8
  - @dataplan/json@0.0.1-alpha.11

## 5.0.0-alpha.12

### Patch Changes

- [#396](https://github.com/benjie/crystal/pull/396)
  [`17fe531d7`](https://github.com/benjie/crystal/commit/17fe531d729e88a7126b0e2e06fc1ee9ab3ac5b8)
  Thanks [@benjie](https://github.com/benjie)! - pgUnionAll uses a slightly more
  optimal SQL (where JSON isn't cast to `::text` and then back to `::json`)

- [#398](https://github.com/benjie/crystal/pull/398)
  [`b7533bd4d`](https://github.com/benjie/crystal/commit/b7533bd4dfc210cb8b113b8fa06f163a212aa5e4)
  Thanks [@benjie](https://github.com/benjie)! - Incremental delivery will no
  longer deliver payloads for paths that don't exist when an error is thrown in
  an output plan.

- [#376](https://github.com/benjie/crystal/pull/376)
  [`326aa99cd`](https://github.com/benjie/crystal/commit/326aa99cd5e6b5cc8f30e4500382738eb63b792d)
  Thanks [@benjie](https://github.com/benjie)! - Can now give constraints
  separate forward/backward behaviors

- [#385](https://github.com/benjie/crystal/pull/385)
  [`7c5a0fe3a`](https://github.com/benjie/crystal/commit/7c5a0fe3a8c28aeac0dd9ab90d7a29170c542e5b)
  Thanks [@benjie](https://github.com/benjie)! - makeV4Preset is now typed to
  support arbitrary schema options (it already supported this, but the types
  didn't allow it).

- [#396](https://github.com/benjie/crystal/pull/396)
  [`b5eb7c490`](https://github.com/benjie/crystal/commit/b5eb7c490305b869e1bfc176a5a417e28f1411cd)
  Thanks [@benjie](https://github.com/benjie)! - Cursor pagination over nullable
  columns _should_ now work, although it is untested.

- [#399](https://github.com/benjie/crystal/pull/399)
  [`976958e80`](https://github.com/benjie/crystal/commit/976958e80c791819cd80e96df8209dcff1918585)
  Thanks [@benjie](https://github.com/benjie)! - Plugins can now use
  build.grafast rather than adding grafast as a peerDependency.

- [#399](https://github.com/benjie/crystal/pull/399)
  [`e0f322b79`](https://github.com/benjie/crystal/commit/e0f322b795abc7242490542d35d3467bde3141d7)
  Thanks [@benjie](https://github.com/benjie)! - Re-export dependencies at
  `postgraphile/{depName}` e.g. `postgraphile/@dataplan/pg` so exports can be
  used without peerDependency/hoisting issues.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`7573bf374`](https://github.com/benjie/crystal/commit/7573bf374897228b613b19f37b4e076737db3279)
  Thanks [@benjie](https://github.com/benjie)! - Address a decent number of
  TODO/FIXME/etc comments in the codebase.

- [#378](https://github.com/benjie/crystal/pull/378)
  [`95b2ab41e`](https://github.com/benjie/crystal/commit/95b2ab41e41976de852276b83f7fb5924555e7c5)
  Thanks [@benjie](https://github.com/benjie)! - Support for nested arrays via
  PostgreSQL domains.

- [#386](https://github.com/benjie/crystal/pull/386)
  [`8230fcaeb`](https://github.com/benjie/crystal/commit/8230fcaeb0286c905fc0dad4b7af2d94bac88a44)
  Thanks [@benjie](https://github.com/benjie)! - If an issue occurs whilst
  retrieving attributes for a constraint, we now log an error and return an
  empty array.

- [#398](https://github.com/benjie/crystal/pull/398)
  [`c43802d74`](https://github.com/benjie/crystal/commit/c43802d7419f93d18964c654f16d0937a2e23ca0)
  Thanks [@benjie](https://github.com/benjie)! - Fix a number of issues relating
  to incremental delivery and iterators

- [#398](https://github.com/benjie/crystal/pull/398)
  [`b118b8f6d`](https://github.com/benjie/crystal/commit/b118b8f6dc18196212cfb0a05486e1dd8d77ccf8)
  Thanks [@benjie](https://github.com/benjie)! - Incremental delivery `@stream`
  now works for regular steps as well as streamable steps.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`b66d2503b`](https://github.com/benjie/crystal/commit/b66d2503b90eb458af709bb593e5a00d869df03f)
  Thanks [@benjie](https://github.com/benjie)! - hasNextPage (via hasMore) now
  uses an access plan rather than a lambda plan.

- [#401](https://github.com/benjie/crystal/pull/401)
  [`b868aa63f`](https://github.com/benjie/crystal/commit/b868aa63f7759396b71fdd1e8eda1012352ad595)
  Thanks [@benjie](https://github.com/benjie)! - Added `Build.dataplanPg` so
  plugins don't need to import this module.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`3caaced6c`](https://github.com/benjie/crystal/commit/3caaced6cfbac4a187a245a61eb103edcb8cd4c9)
  Thanks [@benjie](https://github.com/benjie)! - When fetching a single row, an
  `ORDER BY` clause will no longer be added.

- Updated dependencies
  [[`659508371`](https://github.com/benjie/crystal/commit/659508371e79e76b581532978fe26d50a54e6248),
  [`409581534`](https://github.com/benjie/crystal/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd),
  [`4d64ac127`](https://github.com/benjie/crystal/commit/4d64ac12799be55680448aab6906312bcbc525ab),
  [`17fe531d7`](https://github.com/benjie/crystal/commit/17fe531d729e88a7126b0e2e06fc1ee9ab3ac5b8),
  [`b7533bd4d`](https://github.com/benjie/crystal/commit/b7533bd4dfc210cb8b113b8fa06f163a212aa5e4),
  [`326aa99cd`](https://github.com/benjie/crystal/commit/326aa99cd5e6b5cc8f30e4500382738eb63b792d),
  [`56b52295c`](https://github.com/benjie/crystal/commit/56b52295c77d1748c01754d5e71702e05c8a2dd3),
  [`9238d3ce4`](https://github.com/benjie/crystal/commit/9238d3ce4f6f59295ba849d6325286e4847c1bac),
  [`9feb769c2`](https://github.com/benjie/crystal/commit/9feb769c2df0c57971ed26a937be4a1bee7a7524),
  [`b5eb7c490`](https://github.com/benjie/crystal/commit/b5eb7c490305b869e1bfc176a5a417e28f1411cd),
  [`976958e80`](https://github.com/benjie/crystal/commit/976958e80c791819cd80e96df8209dcff1918585),
  [`7573bf374`](https://github.com/benjie/crystal/commit/7573bf374897228b613b19f37b4e076737db3279),
  [`95b2ab41e`](https://github.com/benjie/crystal/commit/95b2ab41e41976de852276b83f7fb5924555e7c5),
  [`2c8586b36`](https://github.com/benjie/crystal/commit/2c8586b367b76af91d1785cc90455c70911fdec7),
  [`8230fcaeb`](https://github.com/benjie/crystal/commit/8230fcaeb0286c905fc0dad4b7af2d94bac88a44),
  [`6f545683c`](https://github.com/benjie/crystal/commit/6f545683c981af4ee40d51b272a053b01d535491),
  [`c43802d74`](https://github.com/benjie/crystal/commit/c43802d7419f93d18964c654f16d0937a2e23ca0),
  [`b118b8f6d`](https://github.com/benjie/crystal/commit/b118b8f6dc18196212cfb0a05486e1dd8d77ccf8),
  [`b66d2503b`](https://github.com/benjie/crystal/commit/b66d2503b90eb458af709bb593e5a00d869df03f),
  [`9008c4f87`](https://github.com/benjie/crystal/commit/9008c4f87df53be4051c49f9836358dc2baa59df),
  [`47ff7e824`](https://github.com/benjie/crystal/commit/47ff7e824b2fc96c11f601c3814d0200208711ce),
  [`b868aa63f`](https://github.com/benjie/crystal/commit/b868aa63f7759396b71fdd1e8eda1012352ad595),
  [`e8c81cd20`](https://github.com/benjie/crystal/commit/e8c81cd2046390ed5b6799aa7ff3d90b28a1861a),
  [`3caaced6c`](https://github.com/benjie/crystal/commit/3caaced6cfbac4a187a245a61eb103edcb8cd4c9),
  [`9f2507ed9`](https://github.com/benjie/crystal/commit/9f2507ed9fe8a6abe93c9c8a1cff410446587fd6)]:
  - @dataplan/pg@0.0.1-alpha.11
  - graphile-build-pg@5.0.0-alpha.12
  - graphile-build@5.0.0-alpha.11
  - grafserv@0.0.1-alpha.10
  - grafast@0.0.1-alpha.10
  - ruru@2.0.0-alpha.7
  - pg-introspection@0.0.1-alpha.3
  - @dataplan/json@0.0.1-alpha.10

## 5.0.0-alpha.11

### Patch Changes

- [#349](https://github.com/benjie/crystal/pull/349)
  [`a94f11091`](https://github.com/benjie/crystal/commit/a94f11091520b52d90fd007986760848ed20017b)
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

- [#355](https://github.com/benjie/crystal/pull/355)
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84)
  Thanks [@benjie](https://github.com/benjie)! - **MAJOR BREAKING CHANGE**:
  implicit application of args/input fields has been removed.

  Previously we would track the fieldArgs that you accessed (via `.get()`,
  `.getRaw()` or `.apply()`) and those that you _did not access_ would
  automatically have their `applyPlan` called, if they had one. This isn't
  likely to be particularly useful for pure Gra*fast* users (unless they want to
  adopt this pattern) but it's extremely useful for plugin-based schemas as it
  allows plugins to add arguments that can influence their field's plan _without
  having to wrap the field's plan resolver function_. This is fairly critical,
  otherwise each behavior added (`first:`, `condition:`, `orderBy:`, `filter:`,
  `ignoreArchived:`, etc etc) would wrap the plan resolver with another function
  layer, and they would get _messy_.

  However, implicit is rarely good. And it turns out that it severely limited
  what I wanted to do for improving the `fieldArgs` APIs.

  I decided to remove this implicit functionality by making it more explicit, so
  now args/input fields can specify the relevant
  `autoApplyAfterParent{Plan,SubscribePlan,InputPlan,ApplyPlan}: true` property
  and we'll only apply them at a single level.

  From a user perspective, little has changed. From a plugin author perspective,
  if you were relying on the implicit `applyPlan` then you should now add the
  relevant `autoApply*` property next to your `applyPlan` method.

- [#363](https://github.com/benjie/crystal/pull/363)
  [`bcfffd5fe`](https://github.com/benjie/crystal/commit/bcfffd5fe14d5bbc3517c62041da585a3bf1bab1)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug causing `@foreignKey`
  relation to not show up under rare circumstances (by updating
  PgRelationsPlugin to use codec, not resource, as the primary entity).

- [#362](https://github.com/benjie/crystal/pull/362)
  [`e443db39b`](https://github.com/benjie/crystal/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)
  Thanks [@benjie](https://github.com/benjie)! - Use original case for table
  resource names.

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/crystal/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/crystal/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`a94f11091`](https://github.com/benjie/crystal/commit/a94f11091520b52d90fd007986760848ed20017b),
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/crystal/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/crystal/commit/2ac706f18660c855fe20f460b50694fdd04a7768),
  [`77e011294`](https://github.com/benjie/crystal/commit/77e01129450ab78d55d3868661e37b0c99db3da5),
  [`bcfffd5fe`](https://github.com/benjie/crystal/commit/bcfffd5fe14d5bbc3517c62041da585a3bf1bab1),
  [`dad4d4aae`](https://github.com/benjie/crystal/commit/dad4d4aaee499098104841740c9049b1deb6ac5f),
  [`e443db39b`](https://github.com/benjie/crystal/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)]:
  - grafast@0.0.1-alpha.9
  - graphile-build-pg@5.0.0-alpha.11
  - graphile-build@5.0.0-alpha.10
  - graphile-config@0.0.1-alpha.4
  - @dataplan/pg@0.0.1-alpha.10
  - grafserv@0.0.1-alpha.9
  - ruru@2.0.0-alpha.6

## 5.0.0-alpha.10

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/crystal/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8
  - @dataplan/pg@0.0.1-alpha.9
  - grafserv@0.0.1-alpha.8
  - graphile-build@5.0.0-alpha.9
  - graphile-build-pg@5.0.0-alpha.10

## 5.0.0-alpha.9

### Patch Changes

- [#346](https://github.com/benjie/crystal/pull/346)
  [`9ddaaaa96`](https://github.com/benjie/crystal/commit/9ddaaaa9617874cb44946acfcd252517ae427446)
  Thanks [@benjie](https://github.com/benjie)! - Fix a bug in subscriptions
  where variables were not recognized

- [#345](https://github.com/benjie/crystal/pull/345)
  [`3a984718a`](https://github.com/benjie/crystal/commit/3a984718a322685304777dec7cd48a1efa15539d)
  Thanks [@benjie](https://github.com/benjie)! - Cursor validation errors are
  now raised by the connection directly, rather than the subfields.

- [#340](https://github.com/benjie/crystal/pull/340)
  [`fe9154b23`](https://github.com/benjie/crystal/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215)
  Thanks [@benjie](https://github.com/benjie)! - Make Datetime RFC3339
  compatible when a timezone is present

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/crystal/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`9ddaaaa96`](https://github.com/benjie/crystal/commit/9ddaaaa9617874cb44946acfcd252517ae427446),
  [`2fcbe688c`](https://github.com/benjie/crystal/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/crystal/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`fe9154b23`](https://github.com/benjie/crystal/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215),
  [`adc7ae5e0`](https://github.com/benjie/crystal/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - grafserv@0.0.1-alpha.7
  - graphile-build-pg@5.0.0-alpha.9
  - @dataplan/pg@0.0.1-alpha.8
  - graphile-build@5.0.0-alpha.8
  - graphile-config@0.0.1-alpha.3
  - ruru@2.0.0-alpha.5

## 5.0.0-alpha.8

### Patch Changes

- [#338](https://github.com/benjie/crystal/pull/338)
  [`dcc3d0355`](https://github.com/benjie/crystal/commit/dcc3d03558d28506260dcfc79e1a797b60ec1773)
  Thanks [@benjie](https://github.com/benjie)! - `@interface mode:union`
  interfaces now also gain root fields.

- [#339](https://github.com/benjie/crystal/pull/339)
  [`f75926f4b`](https://github.com/benjie/crystal/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)
  Thanks [@benjie](https://github.com/benjie)! - CRITICAL BUGFIX: mistake in
  optimization of list() can lead to arrays being truncated

- [#338](https://github.com/benjie/crystal/pull/338)
  [`ca1526b70`](https://github.com/benjie/crystal/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6)
  Thanks [@benjie](https://github.com/benjie)! - Fix startCursor/endCursor for
  connections using pgUnionAll steps.

- [#338](https://github.com/benjie/crystal/pull/338)
  [`3426b0f4a`](https://github.com/benjie/crystal/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)
  Thanks [@benjie](https://github.com/benjie)! - Fix bugs in pgUnionAll
  connections relating to PageInfo

- Updated dependencies
  [[`dcc3d0355`](https://github.com/benjie/crystal/commit/dcc3d03558d28506260dcfc79e1a797b60ec1773),
  [`f75926f4b`](https://github.com/benjie/crystal/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba),
  [`ca1526b70`](https://github.com/benjie/crystal/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6),
  [`3426b0f4a`](https://github.com/benjie/crystal/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)]:
  - graphile-build-pg@5.0.0-alpha.8
  - grafast@0.0.1-alpha.6
  - @dataplan/pg@0.0.1-alpha.7
  - grafserv@0.0.1-alpha.6
  - graphile-build@5.0.0-alpha.7

## 5.0.0-alpha.7

### Patch Changes

- [#335](https://github.com/benjie/crystal/pull/335)
  [`ef8432511`](https://github.com/benjie/crystal/commit/ef84325111416a9663417bb58ec664998040cf7c)
  Thanks [@benjie](https://github.com/benjie)! - Have ref fields support
  ordering and filtering.

- [#336](https://github.com/benjie/crystal/pull/336)
  [`24822d0dc`](https://github.com/benjie/crystal/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)
  Thanks [@benjie](https://github.com/benjie)! - Fix over-cautious throw when
  dealing with recursive inputs.

- Updated dependencies
  [[`ef8432511`](https://github.com/benjie/crystal/commit/ef84325111416a9663417bb58ec664998040cf7c),
  [`86e503d78`](https://github.com/benjie/crystal/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`2850e4732`](https://github.com/benjie/crystal/commit/2850e4732ff173347357dba048eaf3c1ef775497),
  [`24822d0dc`](https://github.com/benjie/crystal/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - graphile-build-pg@5.0.0-alpha.7
  - grafast@0.0.1-alpha.5
  - graphile-build@5.0.0-alpha.6
  - @dataplan/pg@0.0.1-alpha.6
  - grafserv@0.0.1-alpha.5

## 5.0.0-alpha.6

### Patch Changes

- [#334](https://github.com/benjie/crystal/pull/334)
  [`1ea7acdf5`](https://github.com/benjie/crystal/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)
  Thanks [@benjie](https://github.com/benjie)! - Tweak peerDependencies

- Updated dependencies
  [[`1ea7acdf5`](https://github.com/benjie/crystal/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)]:
  - graphile-build-pg@5.0.0-alpha.6
  - @dataplan/pg@0.0.1-alpha.5

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/crystal/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950),
  [`f34bd5a3c`](https://github.com/benjie/crystal/commit/f34bd5a3c353693b86a0307357a3620110700e1c)]:
  - grafast@0.0.1-alpha.4
  - @dataplan/pg@0.0.1-alpha.4
  - ruru@2.0.0-alpha.4
  - grafserv@0.0.1-alpha.4
  - graphile-build@5.0.0-alpha.5
  - graphile-build-pg@5.0.0-alpha.5

## 5.0.0-alpha.4

### Patch Changes

- [#332](https://github.com/benjie/crystal/pull/332)
  [`faa1c9eaa`](https://github.com/benjie/crystal/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)
  Thanks [@benjie](https://github.com/benjie)! - Adjust dependencies and
  peerDependencies and peerDependenciesMeta.

- Updated dependencies
  [[`faa1c9eaa`](https://github.com/benjie/crystal/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)]:
  - graphile-build-pg@5.0.0-alpha.4
  - graphile-build@5.0.0-alpha.4
  - @dataplan/pg@0.0.1-alpha.3

## 5.0.0-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- [`9605165d5`](https://github.com/benjie/crystal/commit/9605165d5857c97053778275836b95bf19c0b1c9)
  Thanks [@benjie](https://github.com/benjie)! - Fix naming conflict that occurs
  with `@enum` smart tag when not using `@enumName`. New `enumTableEnum`
  inflector.
- Updated dependencies
  [[`21e95326d`](https://github.com/benjie/crystal/commit/21e95326d72eaad7a8860c4c21a11736191f169b),
  [`98ae00f59`](https://github.com/benjie/crystal/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`2389f47ec`](https://github.com/benjie/crystal/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`2fe247f75`](https://github.com/benjie/crystal/commit/2fe247f751377e18b3d6809cba39a01aa1602dbc),
  [`e91ee201d`](https://github.com/benjie/crystal/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/crystal/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`9605165d5`](https://github.com/benjie/crystal/commit/9605165d5857c97053778275836b95bf19c0b1c9),
  [`d39a5d409`](https://github.com/benjie/crystal/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - graphile-export@0.0.2-alpha.2
  - @graphile/lru@5.0.0-alpha.2
  - grafast@0.0.1-alpha.3
  - ruru@2.0.0-alpha.3
  - @dataplan/pg@0.0.1-alpha.3
  - grafserv@0.0.1-alpha.3
  - graphile-build@5.0.0-alpha.3
  - graphile-build-pg@5.0.0-alpha.3
  - graphile-config@0.0.1-alpha.2
  - pg-introspection@0.0.1-alpha.2

## 5.0.0-alpha.2

### Patch Changes

- [#305](https://github.com/benjie/crystal/pull/305)
  [`3cf35fdb4`](https://github.com/benjie/crystal/commit/3cf35fdb41d08762e9ff838a55dd7fc6004941f8)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Ruru is now a CommonJS
  module, no longer an ESM module.

  Ruru CLI now reads options from a `graphile.config.ts` file if present.

  It's now possible to customize the HTML that Ruru is served with (specifically
  the meta, title, stylesheets, header JS, body content, body JS, and init
  script), either via configuration:

  ```ts
  import { defaultHTMLParts } from "ruru/server";

  const preset: GraphileConfig.Preset = {
    //...
    ruru: {
      htmlParts: {
        titleTag: "<title>GraphiQL with Grafast support - Ruru!</title>",
        metaTags:
          defaultHTMLParts.metaTags +
          `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      },
    },
  };
  ```

  or via a plugin, which allows you to change it on a per-request (per-user)
  basis:

  ```ts
  const RuruMetaPlugin: GraphileConfig.Plugin = {
    name: "RuruMetaPlugin",
    version: "0.0.0",
    grafserv: {
      hooks: {
        ruruHTMLParts(_info, parts, extra) {
          // extra.request gives you access to request details, so you can customize `parts` for the user

          parts.metaTags += `<meta name="viewport" content="width=device-width, initial-scale=1" />`;
        },
      },
    },
  };
  ```

- [#307](https://github.com/benjie/crystal/pull/307)
  [`7c45eaf4e`](https://github.com/benjie/crystal/commit/7c45eaf4ed6edf3b9e7bb17846d553f5504e0fb4)
  Thanks [@benjie](https://github.com/benjie)! - 🚨
  'application/x-www-form-urlencoded' is now opt-in (unless you're using the V4
  preset).

  CSRF and CORS are tricky topics. When you use PostGraphile as part of a larger
  system, it's your responsibility to ensure that you don't open yourself up to
  CSRF/etc issues (e.g. by using CSRF/XSRF tokens, by using `SameSite` cookie
  policies, by checking the `Origin` of requests, or by using a combination of
  these or other techniques).

  Out of the box, PostGraphile does not use cookies, so any cross-origin
  requests are harmless because an attacker without the actual user token in
  hand can only execute unauthenticated requests.

  However, once cookies (and sessions) enter the equation, suddenly CSRF becomes
  a risk. Normally you cannot submit an `Content-Type: application/json` request
  cross origins (unless you've enabled CORS), so this content type doesn't open
  CSRF issues on its own, but `Content-Type: application/x-www-form-urlencoded`
  can be submitted cross origins without CORS policies. The attacker won't be
  able to view the response, but that doesn't mean they can't cause havoc by
  triggering dangerous mutations using the user's credentials.

  We've decided to take the stance of making `application/x-www-form-urlencoded`
  opt-in; you can opt-in via your graphile.config.ts (or equivalent) like so:

  ```ts
  import { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "grafserv";

  const preset: GraphileConfig.Preset = {
    //...

    grafserv: {
      //...

      allowedRequestContentTypes: [
        ...DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES,
        "application/x-www-form-urlencoded",
      ],
    },
  };
  ```

  If you're using the V4 preset then we pull in the V4 behavior of enabling this
  content type by default (since you presumably already have protections in
  place); however we recommend disabling this media type if you're not using it:

  ```ts
  import { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "grafserv";

  const preset: GraphileConfig.Preset = {
    //... extends V4 preset ...

    grafserv: {
      //...

      allowedRequestContentTypes: DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES,
    },
  };
  ```

  Note that this media type is not currently part of the
  [GraphQL-over-HTTP specification](https://graphql.github.io/graphql-over-http/draft/#sec-Media-Types)
  so disabling it does not make your server non-compliant.

- Updated dependencies
  [[`3cf35fdb4`](https://github.com/benjie/crystal/commit/3cf35fdb41d08762e9ff838a55dd7fc6004941f8),
  [`7c45eaf4e`](https://github.com/benjie/crystal/commit/7c45eaf4ed6edf3b9e7bb17846d553f5504e0fb4),
  [`3df3f1726`](https://github.com/benjie/crystal/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafserv@0.0.1-alpha.2
  - ruru@2.0.0-alpha.2
  - grafast@0.0.1-alpha.2
  - @dataplan/pg@0.0.1-alpha.2
  - graphile-build-pg@5.0.0-alpha.2
  - graphile-build@5.0.0-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - @dataplan/pg@0.0.1-alpha.1
  - grafast@0.0.1-alpha.1
  - grafserv@0.0.1-alpha.1
  - ruru@2.0.0-alpha.1
  - graphile-build@5.0.0-alpha.1
  - graphile-build-pg@5.0.0-alpha.1
  - graphile-config@0.0.1-alpha.1
  - graphile-export@0.0.2-alpha.1
  - @graphile/lru@5.0.0-alpha.1
  - pg-introspection@0.0.1-alpha.1

## 5.0.0-1.3

### Patch Changes

- [#297](https://github.com/benjie/crystal/pull/297)
  [`90ed0cb7a`](https://github.com/benjie/crystal/commit/90ed0cb7a78479b85115cd1ce045ac253107b3eb)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul websocket handling in
  Grafserv providing cleaner integration with Grafast.

- [#297](https://github.com/benjie/crystal/pull/297)
  [`56be761c2`](https://github.com/benjie/crystal/commit/56be761c29343e28ba4980c62c955b5adaef25c0)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now has a plugin
  system (via graphile-config), first plugin hook enables manipulating the
  incoming request body which is useful for persisted operations.
- Updated dependencies
  [[`90ed0cb7a`](https://github.com/benjie/crystal/commit/90ed0cb7a78479b85115cd1ce045ac253107b3eb),
  [`56be761c2`](https://github.com/benjie/crystal/commit/56be761c29343e28ba4980c62c955b5adaef25c0),
  [`8d270ead3`](https://github.com/benjie/crystal/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`1a012bdd7`](https://github.com/benjie/crystal/commit/1a012bdd7d3748ac9a4ca9b1f771876654988f25),
  [`b4eaf89f4`](https://github.com/benjie/crystal/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafserv@0.0.1-1.3
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2
  - graphile-build-pg@5.0.0-1.3
  - @dataplan/pg@0.0.1-1.3
  - graphile-build@5.0.0-1.3
  - ruru@2.0.0-1.2

## 5.0.0-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/crystal/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2
  - @dataplan/pg@0.0.1-1.2
  - grafserv@0.0.1-1.2
  - graphile-build@5.0.0-1.2
  - graphile-build-pg@5.0.0-1.2

## 5.0.0-1.1

### Patch Changes

- [#279](https://github.com/benjie/crystal/pull/279)
  [`2df36c5a1`](https://github.com/benjie/crystal/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7)
  Thanks [@benjie](https://github.com/benjie)! - `description` moved out of
  `extensions` to live directly on all the relevant entities.

- [#279](https://github.com/benjie/crystal/pull/279)
  [`a73f9c709`](https://github.com/benjie/crystal/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26)
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

- [#267](https://github.com/benjie/crystal/pull/267)
  [`159735204`](https://github.com/benjie/crystal/commit/15973520462d4a95e3cdf04fdacfc71ca851122f)
  Thanks [@benjie](https://github.com/benjie)! - Add formatting for SQL aliases

- [#270](https://github.com/benjie/crystal/pull/270)
  [`ef42d717c`](https://github.com/benjie/crystal/commit/ef42d717c38df7fddc1cd3a5b97dc8d68419417a)
  Thanks [@benjie](https://github.com/benjie)! - SQL is now generated in a
  slightly different way, helping PostgreSQL to optimize queries that have a
  batch size of 1. Also removes internal mapping code as we now simply append
  placeholder values rather than search and replacing a symbol (eradicates
  `queryValuesSymbol` and related hacks). If you manually issue queries through
  `PgExecutor` (_extremely_ unlikely!) then you'll want to check out PR #270 to
  see the differences.

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#285](https://github.com/benjie/crystal/pull/285)
  [`bd37be707`](https://github.com/benjie/crystal/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1)
  Thanks [@benjie](https://github.com/benjie)! - Single table inheritance no
  longer exposes non-shared columns via condition/order, and also only exposes
  the relationships on the types where they are appropriate.

- [#270](https://github.com/benjie/crystal/pull/270)
  [`f8954fb17`](https://github.com/benjie/crystal/commit/f8954fb17bbcb0f6633475d09924cdd9f94aaf23)
  Thanks [@benjie](https://github.com/benjie)! - `EXPLAIN ANALYZE` (for
  `SELECT`) and `EXPLAIN` (for other operations) support added. Currently
  requires `DEBUG="datasource:pg:PgExecutor:explain"` to be set. Publish this
  through all the way to Ruru.

- [#260](https://github.com/benjie/crystal/pull/260)
  [`96b0bd14e`](https://github.com/benjie/crystal/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4)
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

- [#271](https://github.com/benjie/crystal/pull/271)
  [`d951897ee`](https://github.com/benjie/crystal/commit/d951897eea824acabdb17baab4bf900b4b3b842f)
  Thanks [@benjie](https://github.com/benjie)! - Add extensions.pg to Postgres
  function resources (makes it easier for plugins to hook them).

- [#270](https://github.com/benjie/crystal/pull/270)
  [`c564825f3`](https://github.com/benjie/crystal/commit/c564825f3fda0083e536154c4c34ce0b2948eba4)
  Thanks [@benjie](https://github.com/benjie)! - `set jit = 'off'` replaced with
  `set jit_optimize_above_cost = -1` so that JIT can still be used but heavy
  optimization costs are not incurred.

- [#286](https://github.com/benjie/crystal/pull/286)
  [`366b166dc`](https://github.com/benjie/crystal/commit/366b166dc88a340de7f092f92840b0fba1f03d60)
  Thanks [@benjie](https://github.com/benjie)! - Add detection for `@ref` that
  is missing `singular`, fix docs and test schema and add tests for same.

- [#271](https://github.com/benjie/crystal/pull/271)
  [`261eb520b`](https://github.com/benjie/crystal/commit/261eb520b33fe3673fe3a7712085e50291aed1e5)
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

- [#266](https://github.com/benjie/crystal/pull/266)
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)
  Thanks [@benjie](https://github.com/benjie)! - The Grafast step class
  'execute' and 'stream' methods now have a new additional first argument
  `count` which indicates how many results they must return. This means we don't
  need to rely on the `values[0].length` trick to determine how many results to
  return, and thus we can pass through an empty tuple to steps that have no
  dependencies.

- [#268](https://github.com/benjie/crystal/pull/268)
  [`a14cf5f4c`](https://github.com/benjie/crystal/commit/a14cf5f4c233cd794eb4d3c6f2281e747d234a71)
  Thanks [@benjie](https://github.com/benjie)! - PgV4NoIgnoreIndexesPlugin is
  now PgIndexBehaviorsPlugin, moved to graphile-build-pg, and is enabled by
  default
- Updated dependencies
  [[`2df36c5a1`](https://github.com/benjie/crystal/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7),
  [`c5d89d705`](https://github.com/benjie/crystal/commit/c5d89d7052dfaaf4c597c8c36858795fa7227b07),
  [`a73f9c709`](https://github.com/benjie/crystal/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26),
  [`ae304b33c`](https://github.com/benjie/crystal/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`159735204`](https://github.com/benjie/crystal/commit/15973520462d4a95e3cdf04fdacfc71ca851122f),
  [`ef42d717c`](https://github.com/benjie/crystal/commit/ef42d717c38df7fddc1cd3a5b97dc8d68419417a),
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/crystal/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`c22dcde7b`](https://github.com/benjie/crystal/commit/c22dcde7b53af323d907b22a0a69924841072aa9),
  [`bd37be707`](https://github.com/benjie/crystal/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1),
  [`f8954fb17`](https://github.com/benjie/crystal/commit/f8954fb17bbcb0f6633475d09924cdd9f94aaf23),
  [`96b0bd14e`](https://github.com/benjie/crystal/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4),
  [`d951897ee`](https://github.com/benjie/crystal/commit/d951897eea824acabdb17baab4bf900b4b3b842f),
  [`fbf1da26a`](https://github.com/benjie/crystal/commit/fbf1da26a9208519ee58f7ac34dd7e569bf1f9e5),
  [`c564825f3`](https://github.com/benjie/crystal/commit/c564825f3fda0083e536154c4c34ce0b2948eba4),
  [`366b166dc`](https://github.com/benjie/crystal/commit/366b166dc88a340de7f092f92840b0fba1f03d60),
  [`261eb520b`](https://github.com/benjie/crystal/commit/261eb520b33fe3673fe3a7712085e50291aed1e5),
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef),
  [`a14cf5f4c`](https://github.com/benjie/crystal/commit/a14cf5f4c233cd794eb4d3c6f2281e747d234a71),
  [`f6e644bd3`](https://github.com/benjie/crystal/commit/f6e644bd35be1ee2b63c8636785a241d863b8b5d)]:
  - graphile-build-pg@5.0.0-1.1
  - @dataplan/pg@0.0.1-1.1
  - graphile-build@5.0.0-1.1
  - grafast@0.0.1-1.1
  - ruru@2.0.0-1.1
  - pg-introspection@0.0.1-1.1
  - graphile-config@0.0.1-1.1
  - graphile-export@0.0.2-1.1
  - grafserv@0.0.1-1.1
  - @graphile/lru@5.0.0-1.1

## 5.0.0-0.37

### Patch Changes

- [#257](https://github.com/benjie/crystal/pull/257)
  [`89d16c972`](https://github.com/benjie/crystal/commit/89d16c972f12659de091b0b866768cacfccc8f6b)
  Thanks [@benjie](https://github.com/benjie)! - PgClassSinglePlan is now
  enforced, users will be informed if plans return a step incompatible with the
  given GraphQL object type.

- [#257](https://github.com/benjie/crystal/pull/257)
  [`8f323bdc8`](https://github.com/benjie/crystal/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf)
  Thanks [@benjie](https://github.com/benjie)! - When multiple versions of
  grafast or pg-sql2 are detected, a warning will be raised.

- [#257](https://github.com/benjie/crystal/pull/257)
  [`dd5464e39`](https://github.com/benjie/crystal/commit/dd5464e3986fcc917c8e2dadcec6bfe6bc451e56)
  Thanks [@benjie](https://github.com/benjie)! - `@omit read` on a column now
  omits constraints using that column, as it did in V4.
- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/crystal/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/crystal/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/crystal/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83),
  [`fce77f40e`](https://github.com/benjie/crystal/commit/fce77f40efb194a3dfa7f38bfe20eb99e09efa70),
  [`612092359`](undefined)]:
  - grafast@0.0.1-0.23
  - graphile-build-pg@5.0.0-0.34
  - @dataplan/pg@0.0.1-0.28
  - ruru@2.0.0-0.13
  - grafserv@0.0.1-0.25
  - graphile-build@5.0.0-0.29

## 5.0.0-0.36

### Patch Changes

- [#233](https://github.com/benjie/crystal/pull/233)
  [`a50bc5be4`](https://github.com/benjie/crystal/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8)
  Thanks [@benjie](https://github.com/benjie)! - Introduce new
  GraphQLObjectType_fields_field_args_arg and
  GraphQLInterfaceType_fields_field_args_arg hooks to resolve some plugin
  ordering issues.

- [#233](https://github.com/benjie/crystal/pull/233)
  [`11e7c12c5`](https://github.com/benjie/crystal/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)
  Thanks [@benjie](https://github.com/benjie)! - Solve mutation issue in plugin
  ordering code which lead to heisenbugs.

- [#233](https://github.com/benjie/crystal/pull/233)
  [`2f50a633a`](https://github.com/benjie/crystal/commit/2f50a633acab7c112413ec4576beeec2efef24df)
  Thanks [@benjie](https://github.com/benjie)! - Fix a bug where plugin ordering
  could result in update mutations not being created.

- [#233](https://github.com/benjie/crystal/pull/233)
  [`005e5cea0`](https://github.com/benjie/crystal/commit/005e5cea01224533282bc4d0f3516368fb8db81a)
  Thanks [@benjie](https://github.com/benjie)! - Eradicate
  PgSmartCommentsPlugin, it is no longer needed. Solves some plugin ordering
  issues.
- Updated dependencies
  [[`a50bc5be4`](https://github.com/benjie/crystal/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8),
  [`6fb7ef449`](https://github.com/benjie/crystal/commit/6fb7ef4494b4f61b3b1aa36642e51eb9ec99a941),
  [`11e7c12c5`](https://github.com/benjie/crystal/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85),
  [`2f50a633a`](https://github.com/benjie/crystal/commit/2f50a633acab7c112413ec4576beeec2efef24df),
  [`005e5cea0`](https://github.com/benjie/crystal/commit/005e5cea01224533282bc4d0f3516368fb8db81a)]:
  - graphile-build@5.0.0-0.28
  - graphile-build-pg@5.0.0-0.33
  - graphile-config@0.0.1-0.6
  - grafast@0.0.1-0.22
  - grafserv@0.0.1-0.24
  - ruru@2.0.0-0.12
  - @dataplan/pg@0.0.1-0.27

## 5.0.0-0.35

### Patch Changes

- [#229](https://github.com/benjie/crystal/pull/229)
  [`f5a04cf66`](https://github.com/benjie/crystal/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **BREAKING CHANGE**
  `hookArgs()` now accepts arguments in the same order as `grafast()`:
  `hookArgs(args, resolvedPreset, ctx)`. Please update all your `hookArgs`
  calls.

- [#229](https://github.com/benjie/crystal/pull/229)
  [`a06b8933f`](https://github.com/benjie/crystal/commit/a06b8933f9365627c2eab019af0c12393e29e509)
  Thanks [@benjie](https://github.com/benjie)! - Rename 'eventStreamRoute' to
  'eventStreamPath' for consistency with 'graphqlPath' and 'graphiqlPath'. V4
  preset unaffected.

- [#229](https://github.com/benjie/crystal/pull/229)
  [`ac6137bb6`](https://github.com/benjie/crystal/commit/ac6137bb60a34a3ebf5fad3c6ac153c95acb6158)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 PgRBACPlugin is now included
  in the default `graphile-build-pg` (and thus PostGraphile amber) preset. Users
  of the V4 preset are unaffected.

- [#229](https://github.com/benjie/crystal/pull/229)
  [`9edf7511a`](https://github.com/benjie/crystal/commit/9edf7511ae71928390213ff9c807b7cc7e3174fa)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 pgl.getServerParams() has
  been renamed to pgl.getSchemaResult()

- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/crystal/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa),
  [`13cfc7501`](https://github.com/benjie/crystal/commit/13cfc75019d42353c1e6be394c28c6ba61ab32d0),
  [`b795b3da5`](https://github.com/benjie/crystal/commit/b795b3da5f8e8f13c495be3a8cf71667f3d149f8),
  [`a06b8933f`](https://github.com/benjie/crystal/commit/a06b8933f9365627c2eab019af0c12393e29e509),
  [`b9a2236d4`](https://github.com/benjie/crystal/commit/b9a2236d43cc92e06085298e379de71f7fdedcb7),
  [`ac6137bb6`](https://github.com/benjie/crystal/commit/ac6137bb60a34a3ebf5fad3c6ac153c95acb6158)]:
  - grafast@0.0.1-0.21
  - @dataplan/pg@0.0.1-0.26
  - graphile-build-pg@5.0.0-0.32
  - ruru@2.0.0-0.11
  - grafserv@0.0.1-0.23
  - graphile-build@5.0.0-0.27

## 5.0.0-0.34

### Patch Changes

- [#226](https://github.com/benjie/crystal/pull/226)
  [`2a7c682f4`](https://github.com/benjie/crystal/commit/2a7c682f46ff916c040732d91510fb19f639955e)
  Thanks [@benjie](https://github.com/benjie)! - Enable websockets and add
  better compatibility with V4's pgSettings/additionalGraphQLContextFromRequest
  for websockets when using `makeV4Preset({subscriptions: true})`.

- [#226](https://github.com/benjie/crystal/pull/226)
  [`6a846e009`](https://github.com/benjie/crystal/commit/6a846e00945ba2dcea0cd89f5e6a8ecc5a32775d)
  Thanks [@benjie](https://github.com/benjie)! - Enable users to use Grafserv
  alongside other websocket-enabled entities in their final server.
- Updated dependencies [[`aac8732f9`](undefined),
  [`6a846e009`](https://github.com/benjie/crystal/commit/6a846e00945ba2dcea0cd89f5e6a8ecc5a32775d)]:
  - grafast@0.0.1-0.20
  - grafserv@0.0.1-0.22
  - @dataplan/pg@0.0.1-0.25
  - graphile-build@5.0.0-0.26
  - graphile-build-pg@5.0.0-0.31

## 5.0.0-0.33

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/crystal/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19
  - @dataplan/pg@0.0.1-0.24
  - grafserv@0.0.1-0.21
  - graphile-build@5.0.0-0.25
  - graphile-build-pg@5.0.0-0.30

## 5.0.0-0.32

### Patch Changes

- [#220](https://github.com/benjie/crystal/pull/220)
  [`2abc58cf6`](https://github.com/benjie/crystal/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245)
  Thanks [@benjie](https://github.com/benjie)! - Convert a few more more options
  from V4 to V5.

  Explicitly remove query batching functionality, instead use HTTP2+ or
  websockets or similar.

  Add schema exporting.

- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/crystal/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`2abc58cf6`](https://github.com/benjie/crystal/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245),
  [`c8a56cdc8`](https://github.com/benjie/crystal/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c),
  [`df8c06657`](https://github.com/benjie/crystal/commit/df8c06657e6f5a7d1444d86dc32fd750d1433223)]:
  - grafast@0.0.1-0.18
  - graphile-build@5.0.0-0.24
  - @dataplan/pg@0.0.1-0.23
  - grafserv@0.0.1-0.20
  - graphile-build-pg@5.0.0-0.29

## 5.0.0-0.31

### Patch Changes

- [#218](https://github.com/benjie/crystal/pull/218)
  [`f2c1423fb`](https://github.com/benjie/crystal/commit/f2c1423fbd6c354146a70a9a2ebabd97370b9b05)
  Thanks [@benjie](https://github.com/benjie)! - Option for `@foreignKey` smart
  tag to have unique auto-created for it to ease transition from V4:
  `{ gather: { pgFakeConstraintsAutofixForeignKeyUniqueness: true } }`

- [#219](https://github.com/benjie/crystal/pull/219)
  [`b58f5dfac`](https://github.com/benjie/crystal/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)
  Thanks [@benjie](https://github.com/benjie)! - Rename
  `GraphileBuild.GraphileBuildGatherOptions` to `GraphileBuild.GatherOptions`.
  Rename `GraphileBuild.GraphileBuildInflectionOptions` to
  `GraphileBuild.InflectionOptions`.
- Updated dependencies
  [[`f2c1423fb`](https://github.com/benjie/crystal/commit/f2c1423fbd6c354146a70a9a2ebabd97370b9b05),
  [`b58f5dfac`](https://github.com/benjie/crystal/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)]:
  - graphile-build-pg@5.0.0-0.28
  - graphile-build@5.0.0-0.23

## 5.0.0-0.30

### Patch Changes

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17
  - graphile-build@5.0.0-0.22
  - @dataplan/pg@0.0.1-0.22
  - grafserv@0.0.1-0.19
  - graphile-build-pg@5.0.0-0.27

## 5.0.0-0.29

### Patch Changes

- [#214](https://github.com/benjie/crystal/pull/214)
  [`3ed7d3349`](https://github.com/benjie/crystal/commit/3ed7d334939e5e0ab2f63b2fde202884cc2daa74)
  Thanks [@benjie](https://github.com/benjie)! - @uniqueKey smart tag now
  converted via V4 preset to @unique.

- Updated dependencies
  [[`7e3bfef04`](https://github.com/benjie/crystal/commit/7e3bfef04ebb76fbde8273341ec92073b9e9f04d),
  [`df89aba52`](https://github.com/benjie/crystal/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5),
  [`3ed7d3349`](https://github.com/benjie/crystal/commit/3ed7d334939e5e0ab2f63b2fde202884cc2daa74)]:
  - @dataplan/pg@0.0.1-0.21
  - grafast@0.0.1-0.16
  - graphile-build-pg@5.0.0-0.26
  - grafserv@0.0.1-0.18
  - graphile-build@5.0.0-0.21

## 5.0.0-0.28

### Patch Changes

- [`a8d26b30a`](undefined) - `ignoreReplaceIfNotExists` now truly ignores
  replacement inflectors. Better handle disabled NodePlugin.
- Updated dependencies [[`a8d26b30a`](undefined)]:
  - graphile-build-pg@5.0.0-0.25

## 5.0.0-0.27

### Patch Changes

- [`5812ad277`](undefined) - Deal better with NodePlugin being disabled.

- Updated dependencies [[`5812ad277`](undefined)]:
  - graphile-build-pg@5.0.0-0.24

## 5.0.0-0.26

### Patch Changes

- [#210](https://github.com/benjie/crystal/pull/210)
  [`2fb5001b4`](https://github.com/benjie/crystal/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d)
  Thanks [@benjie](https://github.com/benjie)! - retryOnInitFail implemented,
  and bug in introspection cache on error resolved.

- [#210](https://github.com/benjie/crystal/pull/210)
  [`2bd4b619e`](https://github.com/benjie/crystal/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99)
  Thanks [@benjie](https://github.com/benjie)! - Add
  `extensions.pg = { databaseName, schemaName, name }` to various DB-derived
  resources (codecs, sources, etc); this replaces the `originalName` temporary
  solution that we had previously.

- [#210](https://github.com/benjie/crystal/pull/210)
  [`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`2fb5001b4`](https://github.com/benjie/crystal/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d),
  [`2bd4b619e`](https://github.com/benjie/crystal/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99),
  [`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df),
  [`461c03b72`](https://github.com/benjie/crystal/commit/461c03b72477821ec26cbf703011542e453d083c)]:
  - graphile-build@5.0.0-0.20
  - graphile-build-pg@5.0.0-0.23
  - @dataplan/pg@0.0.1-0.20
  - grafast@0.0.1-0.15
  - grafserv@0.0.1-0.17

## 5.0.0-0.25

### Patch Changes

- [`9a6b18fd9`](undefined) - Give postgraphile() a named return type and export
  the V4 plugins from the V4 preset.

## 5.0.0-0.24

### Patch Changes

- [#207](https://github.com/benjie/crystal/pull/207)
  [`c850dd4ec`](https://github.com/benjie/crystal/commit/c850dd4ec0e42e37122f5bca55a079b53bfd895e)
  Thanks [@benjie](https://github.com/benjie)! - Rename 'preset.server' to
  'preset.grafserv'.

- [#207](https://github.com/benjie/crystal/pull/207)
  [`afa0ea5f6`](https://github.com/benjie/crystal/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in subscriptions where
  termination of underlying stream wouldn't terminate the subscription.

- [#206](https://github.com/benjie/crystal/pull/206)
  [`851b78ef2`](https://github.com/benjie/crystal/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.
- Updated dependencies
  [[`d76043453`](https://github.com/benjie/crystal/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79),
  [`c850dd4ec`](https://github.com/benjie/crystal/commit/c850dd4ec0e42e37122f5bca55a079b53bfd895e),
  [`afa0ea5f6`](https://github.com/benjie/crystal/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`92c2378f2`](https://github.com/benjie/crystal/commit/92c2378f297cc917f542b126e1cdddf58e1f0fc3),
  [`851b78ef2`](https://github.com/benjie/crystal/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/crystal/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14
  - grafserv@0.0.1-0.16
  - @dataplan/pg@0.0.1-0.19
  - graphile-build@5.0.0-0.19
  - graphile-build-pg@5.0.0-0.22

## 5.0.0-0.23

### Patch Changes

- [#201](https://github.com/benjie/crystal/pull/201)
  [`dca706ad9`](https://github.com/benjie/crystal/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

- Updated dependencies
  [[`a14bd2288`](https://github.com/benjie/crystal/commit/a14bd2288532b0977945d1c0508e51baef6dba2b),
  [`dca706ad9`](https://github.com/benjie/crystal/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)]:
  - @dataplan/pg@0.0.1-0.18
  - graphile-build@5.0.0-0.18
  - graphile-build-pg@5.0.0-0.21

## 5.0.0-0.22

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - @dataplan/pg@0.0.1-0.17
  - grafast@0.0.1-0.13
  - graphile-build-pg@5.0.0-0.20
  - grafserv@0.0.1-0.15
  - graphile-build@5.0.0-0.17

## 5.0.0-0.21

### Patch Changes

- [#200](https://github.com/benjie/crystal/pull/200)
  [`1e5671cdb`](https://github.com/benjie/crystal/commit/1e5671cdbbf9f4600b74c43eaa7e33b7bfd75fb9)
  Thanks [@benjie](https://github.com/benjie)! - Add support for websocket
  GraphQL subscriptions (via graphql-ws) to grafserv and PostGraphile (currently
  supporting Node, Express, Koa and Fastify)

- [#200](https://github.com/benjie/crystal/pull/200)
  [`5b634a78e`](https://github.com/benjie/crystal/commit/5b634a78e51816071447aceb1edfb813d77d563b)
  Thanks [@benjie](https://github.com/benjie)! - Standardize on `serv.addTo`
  interface, even for Node

- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/crystal/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`e11698473`](https://github.com/benjie/crystal/commit/e1169847303790570bfafa07eb25d8fce53a0391),
  [`1e5671cdb`](https://github.com/benjie/crystal/commit/1e5671cdbbf9f4600b74c43eaa7e33b7bfd75fb9),
  [`fb40bd97b`](https://github.com/benjie/crystal/commit/fb40bd97b8a36da91c6b08e0ce67f1a9419ad91f),
  [`a1158d83e`](https://github.com/benjie/crystal/commit/a1158d83e2d26f7da0182ec2b651f7f1ec202f14),
  [`5b634a78e`](https://github.com/benjie/crystal/commit/5b634a78e51816071447aceb1edfb813d77d563b),
  [`25f5a6cbf`](https://github.com/benjie/crystal/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - @dataplan/pg@0.0.1-0.16
  - grafast@0.0.1-0.12
  - ruru@2.0.0-0.10
  - grafserv@0.0.1-0.14
  - graphile-build@5.0.0-0.16
  - graphile-build-pg@5.0.0-0.19

## 5.0.0-0.20

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#196](https://github.com/benjie/crystal/pull/196)
  [`af9bc38c8`](https://github.com/benjie/crystal/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7)
  Thanks [@benjie](https://github.com/benjie)! - Allow passing `pool` directly
  to `makePgConfig`.

- [#190](https://github.com/benjie/crystal/pull/190)
  [`652cf1073`](https://github.com/benjie/crystal/commit/652cf107316ea5832f69c6a55574632187f5c876)
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

- [#192](https://github.com/benjie/crystal/pull/192)
  [`80091a8e0`](https://github.com/benjie/crystal/commit/80091a8e0343a162bf2b60cf619267a874a67e60)
  Thanks [@benjie](https://github.com/benjie)! - - Conflicts in `pgConfigs`
  (e.g. multiple sources using the same 'name') now detected and output
  - Fix defaults for `pgSettingsKey` and `withPgClientKey` based on config name
  - `makePgConfig` now allows passing `pgSettings` callback and
    `pgSettingsForIntrospection` config object
  - Multiple postgres sources now works nicely with multiple `makePgConfig`
    calls
- Updated dependencies [[`0ab95d0b1`](undefined),
  [`af9bc38c8`](https://github.com/benjie/crystal/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7),
  [`4783bdd7c`](https://github.com/benjie/crystal/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/crystal/commit/652cf107316ea5832f69c6a55574632187f5c876),
  [`752ec9c51`](https://github.com/benjie/crystal/commit/752ec9c516add7c4617b426e97eccd1d4e5b7833),
  [`80091a8e0`](https://github.com/benjie/crystal/commit/80091a8e0343a162bf2b60cf619267a874a67e60)]:
  - @dataplan/pg@0.0.1-0.15
  - grafast@0.0.1-0.11
  - grafserv@0.0.1-0.13
  - graphile-build@5.0.0-0.15
  - graphile-build-pg@5.0.0-0.18
  - graphile-config@0.0.1-0.5
  - pg-introspection@0.0.1-0.3
  - ruru@2.0.0-0.9

## 5.0.0-0.19

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

- Updated dependencies [[`72bf5f535`](undefined)]:
  - graphile-build@5.0.0-0.14
  - graphile-build-pg@5.0.0-0.17

## 5.0.0-0.18

### Patch Changes

- [#184](https://github.com/benjie/crystal/pull/184)
  [`842f6ccbb`](https://github.com/benjie/crystal/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)
  Thanks [@benjie](https://github.com/benjie)! - Handle array-to-object issue in
  graphile-config when multiple presets set an array key.
- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/crystal/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10
  - grafserv@0.0.1-0.12
  - ruru@2.0.0-0.8
  - graphile-build@5.0.0-0.13
  - graphile-build-pg@5.0.0-0.16
  - @dataplan/pg@0.0.1-0.14

## 5.0.0-0.17

### Patch Changes

- [#183](https://github.com/benjie/crystal/pull/183)
  [`ebb24895c`](https://github.com/benjie/crystal/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug when handling stable
  void functions

- [#181](https://github.com/benjie/crystal/pull/181)
  [`d3cba220c`](https://github.com/benjie/crystal/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65)
  Thanks [@benjie](https://github.com/benjie)! - `*FieldName` smart tags are now
  used verbatim rather than being piped through `inflection.camelCase(...)` -
  you've explicitly stated a 'field name' so we should use that. This may be a
  breaking change for you if your field names are currently different
  before/after they are camelCase'd.

- [#183](https://github.com/benjie/crystal/pull/183)
  [`3eb9da95e`](https://github.com/benjie/crystal/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)
  Thanks [@benjie](https://github.com/benjie)! - Fix potential construction loop
  on failure to construct a type

- Updated dependencies
  [[`ebb24895c`](https://github.com/benjie/crystal/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005),
  [`d3cba220c`](https://github.com/benjie/crystal/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65),
  [`3eb9da95e`](https://github.com/benjie/crystal/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)]:
  - graphile-build-pg@5.0.0-0.15
  - graphile-build@5.0.0-0.12

## 5.0.0-0.16

### Patch Changes

- [#178](https://github.com/benjie/crystal/pull/178)
  [`1b040b3ba`](https://github.com/benjie/crystal/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0)
  Thanks [@benjie](https://github.com/benjie)! - `@omit` and similar smart tags
  are now processed on `@foreignKey` and other fake constraints.

- [#176](https://github.com/benjie/crystal/pull/176)
  [`19e2961de`](https://github.com/benjie/crystal/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb)
  Thanks [@benjie](https://github.com/benjie)! - Better graphile.config.\*
  compatibility with ESM-emulation, so 'export default preset;' should work in
  TypeScript even if outputting to CommonJS.

- [#177](https://github.com/benjie/crystal/pull/177)
  [`6be68a53e`](https://github.com/benjie/crystal/commit/6be68a53e21940406a9fd629ee15cb1673497a6e)
  Thanks [@benjie](https://github.com/benjie)! - `@foreignFieldName` smart tag
  is now fed into the `inflection.connectionField(...)` or
  `inflection.listField(...)` inflector as appropriate. If you are using
  `@foreignSimpleFieldName` you may be able to delete that now; alternatively
  you should consider renaming `@foreignFieldName` to
  `@foreignConnectionFieldName` for consistency.
- Updated dependencies
  [[`1b040b3ba`](https://github.com/benjie/crystal/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0),
  [`19e2961de`](https://github.com/benjie/crystal/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`6be68a53e`](https://github.com/benjie/crystal/commit/6be68a53e21940406a9fd629ee15cb1673497a6e),
  [`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-build-pg@5.0.0-0.14
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9
  - grafserv@0.0.1-0.11
  - graphile-build@5.0.0-0.11
  - ruru@2.0.0-0.7
  - @dataplan/pg@0.0.1-0.13

## 5.0.0-0.15

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/crystal/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8
  - @dataplan/pg@0.0.1-0.12
  - grafserv@0.0.1-0.10
  - graphile-build@5.0.0-0.10
  - graphile-build-pg@5.0.0-0.13

## 5.0.0-0.14

### Patch Changes

- [`af9f11f28`](https://github.com/benjie/crystal/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3)
  Thanks [@benjie](https://github.com/benjie)! - 'preset.pgSources' renamed to
  'preset.pgConfigs' to avoid confusion with PgSource class and
  'input.pgSources' used for build.

- [`6ebe3a13e`](https://github.com/benjie/crystal/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a)
  Thanks [@benjie](https://github.com/benjie)! - Enable omitting update/delete
  mutations using behaviors on unique constraints.

- [`0e440a862`](https://github.com/benjie/crystal/commit/0e440a862d29e8db40fd72413223a10de885ef46)
  Thanks [@benjie](https://github.com/benjie)! - Add new
  `--superuser-connection` option to allow installing watch fixtures as
  superuser.

- [`f7d885527`](https://github.com/benjie/crystal/commit/f7d8855276c3ab0bbcaf8505a1f2f6e872d53128)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in server startup
  message where preset.server.graphqlPath was not respected.
- Updated dependencies
  [[`af9f11f28`](https://github.com/benjie/crystal/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3),
  [`6ebe3a13e`](https://github.com/benjie/crystal/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a),
  [`0e440a862`](https://github.com/benjie/crystal/commit/0e440a862d29e8db40fd72413223a10de885ef46)]:
  - graphile-build-pg@5.0.0-0.12
  - graphile-build@5.0.0-0.9
  - @dataplan/pg@0.0.1-0.11

## 5.0.0-0.13

### Patch Changes

- Updated dependencies [[`a40fa6966`](undefined), [`677c8f5fc`](undefined),
  [`8f04af08d`](https://github.com/benjie/crystal/commit/8f04af08da68baf7b2b4d508eac0d2a57064da7b)]:
  - ruru@2.0.0-0.6
  - graphile-build@5.0.0-0.8
  - graphile-build-pg@5.0.0-0.11
  - pg-introspection@0.0.1-0.2
  - grafserv@0.0.1-0.9
  - grafast@0.0.1-0.7
  - @dataplan/pg@0.0.1-0.10

## 5.0.0-0.12

### Patch Changes

- [`c4213e91d`](undefined) - Add pgl.getResolvedPreset() API; fix Ruru
  respecting graphqlPath setting; replace 'instance' with 'pgl'/'serv' as
  appropriate; forbid subscriptions on GET
- Updated dependencies [[`c4213e91d`](undefined)]:
  - @dataplan/pg@0.0.1-0.9
  - grafserv@0.0.1-0.8
  - graphile-build-pg@5.0.0-0.10

## 5.0.0-0.11

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - @dataplan/pg@0.0.1-0.8
  - grafast@0.0.1-0.6
  - grafserv@0.0.1-0.7
  - ruru@2.0.0-0.5
  - graphile-build@5.0.0-0.7
  - graphile-build-pg@5.0.0-0.9
  - graphile-config@0.0.1-0.2
  - pg-introspection@0.0.1-0.1

## 5.0.0-0.10

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.8
  - @dataplan/pg@0.0.1-0.7
  - grafserv@0.0.1-0.6
  - graphile-build@5.0.0-0.6

## 5.0.0-0.9

### Patch Changes

- Updated dependencies [[`768f32681`](undefined)]:
  - @dataplan/pg@0.0.1-0.6
  - grafast@0.0.1-0.4
  - grafserv@0.0.1-0.5
  - ruru@2.0.0-0.4
  - graphile-build@5.0.0-0.5
  - graphile-export@0.0.2-0.4
  - graphile-build-pg@5.0.0-0.7

## 5.0.0-0.8

### Patch Changes

- Updated dependencies [[`0983df3f6`](undefined)]:
  - ruru@2.0.0-0.3
  - grafserv@0.0.1-0.4
  - graphile-build-pg@5.0.0-0.6
  - @dataplan/pg@0.0.1-0.5

## 5.0.0-0.7

### Patch Changes

- [`d7b87b325`](undefined) - Fix importing presets

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`9ebe3d860`](undefined)]:
  - @dataplan/pg@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.6

## 5.0.0-0.5

### Patch Changes

- Updated dependencies [[`bf83f591d`](undefined)]:
  - @dataplan/pg@0.0.1-0.4
  - graphile-build-pg@5.0.0-0.5

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - @dataplan/pg@0.0.1-0.3
  - grafast@0.0.1-0.3
  - grafserv@0.0.1-0.3
  - ruru@2.0.0-0.2
  - graphile-build@5.0.0-0.4
  - graphile-build-pg@5.0.0-0.4
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`6576bd37b`](undefined), [`25037fc15`](undefined)]:
  - ruru@2.0.0-0.1
  - @dataplan/pg@0.0.1-0.2
  - grafast@0.0.1-0.2
  - grafserv@0.0.1-0.2
  - graphile-build-pg@5.0.0-0.3
  - graphile-build@5.0.0-0.3
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - @dataplan/pg@0.0.1-0.1
  - grafast@0.0.1-0.1
  - graphile-build-pg@5.0.0-0.2
  - grafserv@0.0.1-0.1
  - graphile-build@5.0.0-0.2
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - ruru@2.0.0-0.0
  - @dataplan/pg@0.0.1-0.0
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - grafserv@0.0.1-0.0
  - graphile-build@5.0.0-0.1
  - graphile-build-pg@5.0.0-0.1
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
