# eslint-plugin-graphile-export

## 0.0.2-beta.8

### Patch Changes

- [#2574](https://github.com/graphile/crystal/pull/2574)
  [`ec25997a6a2557cde9aaa9e27eb202ad945b6015`](https://github.com/graphile/crystal/commit/ec25997a6a2557cde9aaa9e27eb202ad945b6015)
  Thanks [@benjie](https://github.com/benjie)! - Fix dependency ranges to allow
  ESLint 9

## 0.0.2-beta.7

### Patch Changes

- [#2481](https://github.com/graphile/crystal/pull/2481)
  [`8c1dc528e3c03e2c2855adb7273319412f841c14`](https://github.com/graphile/crystal/commit/8c1dc528e3c03e2c2855adb7273319412f841c14)
  Thanks [@kzlar](https://github.com/kzlar)! - 🚨 Now uses a flat config for
  compatibility with ESLint v9.

- [#2482](https://github.com/graphile/crystal/pull/2482)
  [`459e1869a2ec58925b2bac5458af487c52a8ca37`](https://github.com/graphile/crystal/commit/459e1869a2ec58925b2bac5458af487c52a8ca37)
  Thanks [@benjie](https://github.com/benjie)! - Minimum version of Node.js
  bumped to Node 22 (the latest LTS).

## 0.0.2-beta.6

### Patch Changes

- [#2377](https://github.com/graphile/crystal/pull/2377)
  [`7c38cdeffe034c9b4f5cdd03a8f7f446bd52dcb7`](https://github.com/graphile/crystal/commit/7c38cdeffe034c9b4f5cdd03a8f7f446bd52dcb7)
  Thanks [@benjie](https://github.com/benjie)! - Since `ModifierStep` and
  `BaseStep` are no more; `ExecutableStep` can be renamed to simply `Step`. The
  old name (`ExecutableStep`) is now deprecated.

- [#2398](https://github.com/graphile/crystal/pull/2398)
  [`c041fd250372c57601188b65a6411c8f440afab6`](https://github.com/graphile/crystal/commit/c041fd250372c57601188b65a6411c8f440afab6)
  Thanks [@benjie](https://github.com/benjie)! - Since the following have been
  removed from Grafast, throw an error if they're seen in the schema:

  - `autoApplyAfterParentInputPlan`
  - `autoApplyAfterParentApplyPlan`
  - `autoApplyAfterParentPlan`
  - `autoApplyAfterParentSubscribePlan`
  - `inputPlan`
  - `applyPlan` on input fields

  Also: when Query type fails to build, throw the underlying error directly.

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

## 0.0.2-beta.5

### Patch Changes

- [#2175](https://github.com/graphile/crystal/pull/2175)
  [`c69b2fdec`](https://github.com/graphile/crystal/commit/c69b2fdec2d73f1101440eb96fe126f9ad77db98)
  Thanks [@benjie](https://github.com/benjie)! - Fix 'Container is falsy' error
  message the latest Babel patch release would cause.

## 0.0.2-beta.4

### Patch Changes

- [#1933](https://github.com/graphile/crystal/pull/1933)
  [`3a2ea80ee`](https://github.com/graphile/crystal/commit/3a2ea80ee470b2aef91366727d7d60a0c65067f5)
  Thanks [@mattiarossi](https://github.com/mattiarossi)! -
  `eslint-plugin-graphile-export` now spots instances of `inputPlan`,
  `applyPlan` and `assertStep` so they can be checked - thanks @mattiarossi!

## 0.0.2-beta.3

### Patch Changes

- [#514](https://github.com/graphile/crystal-pre-merge/pull/514)
  [`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)
  Thanks [@benjie](https://github.com/benjie)! - Update package.json repository
  information

## 0.0.2-beta.2

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

## 0.0.2-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

## 0.0.2-alpha.3

### Patch Changes

- [#406](https://github.com/benjie/crystal/pull/406)
  [`ecd7598f1`](https://github.com/benjie/crystal/commit/ecd7598f1a12c724e744249246eec7b882198a8a)
  Thanks [@benjie](https://github.com/benjie)! - More docs for graphile-export

## 0.0.2-alpha.2

### Patch Changes

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

## 0.0.2-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

## 0.0.2-1.1

### Patch Changes

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

## 0.0.2-0.1

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

## 0.0.2-0.0

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release
