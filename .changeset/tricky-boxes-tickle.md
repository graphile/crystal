---
"eslint-plugin-graphile-export": patch
"graphile-build-pg": patch
"graphile-build": patch
"graphile-utils": patch
"postgraphile": patch
"graphile-export": patch
"@dataplan/pg": patch
"grafast": patch
---

Overhaul Grafast to remove more input planning - inputs should be evaluated at
runtime - and remove more plan-time step evaluation.

`FieldArgs.get` is no more; use `FieldArgs.getRaw` or use `bakedInput()` (TODO:
document) to get the "baked" version of a raw input value.

Input object fields no longer have `applyPlan`/`inputPlan`, instead having the
runtime equivalents `apply()` and `baked()`. `FieldArgs` is no longer available
on input object fields, since these fields are no longer called at plantime;
instead, the actual value is passed.

`FieldArgs` gains `.typeAt(path)` method that details the GraphQL input type at
the given path.

Field arguments are no longer passed `FieldArgs`, instead they're passed a
(similar) `FieldArg` object representing the argument value itself.

`autoApplyAfterParentPlan` is no more - instead if an argument has `applyPlan`
it will be called automatically unless it was called during the field plan
resolver itself.

`autoApplyAfterParentSubscribePlan` is no more - instead if an argument has
`applySubscribePlan` it will be called automatically unless it was called during
the field plan resolver itself.

Field arguments no longer support `inputPlan` - use `bakedInput()` if you need
that.

Input fields no longer support `inputPlan`, `applyPlan`,
`autoApplyAfterParentInputPlan` nor `autoApplyAfterParentApplyPlan`. Instead,
`apply()` (which is called by `applyStep()` at runtime) has been added.

`sqlValueWithCodec(value, codec)` can be used at runtime in places where
`$step.placeholder($value, codec)` would have been used previously.
`placeholder` has been removed from all places that are now runtime - namely the
list of modifiers below...

The following `ModifierStep` classes have all dropped their `Step` suffix, these
`Modifier` classes now all run at runtime, and are thus no longer steps; they're
invoked as part of the new `applyInput()` (TODO: document) step:

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

Query builders gain `meta`, an object that can be augmented with metadata about
the operation (typically this relates to cursors and similar functionality).
This is now used to implement `clientMutationId`.

Extends query builders with additional functionality.

Many of the types have had their generics changed, TypeScript should guide you
if you have issues here.

`NodeIdHandler` now requires a `getIdentifiers` method that runs at runtime and
returns the identifiers from a decoded NodeId string.

Types around GraphQL Global Object Identification (i.e. `Node` / `id`) have
changed.
