---
"@graphile/simplify-inflection": patch
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

`PgSource` has been renamed to `PgResource`, `PgTypeCodec` to `PgCodec`,
`PgEnumTypeCodec` to `PgEnumCodec`, `PgTypeColumn` to `PgCodecAttribute` (and
similar for related types/interfaces). `source` has been replaced by `resource`
in various of the APIs where it relates to a `PgResource`.

`PgSourceBuilder` is no more, instead being replaced with `PgResourceOptions`
and being built into the final `PgResource` via the new
`makeRegistryBuilder`/`makeRegistry` functions.

`build.input` no longer contains the `pgSources` directly, instead
`build.input.pgRegistry.pgResources` should be used.

The new registry system also means that various of the hooks in the gather phase
have been renamed/replaced, there's a new `PgRegistryPlugin` plugin in the
default preset. The only plugin that uses the `main` method in the `gather`
phase is now `PgRegistryPlugin` - if you are using the `main` function for
Postgres-related behaviors you should consider moving your logic to hooks
instead.

Plugin ordering has changed and thus the shape of the final schema is likely to
change (please use `lexicographicSortSchema` on your before/after schemas when
comparing).

Relationships are now from a codec to a resource, rather than from resource to
resource, so all the relationship inflectors (`singleRelation`,
`singleRelationBackwards`, `_manyRelation`, `manyRelationConnection`,
`manyRelationList`) now accept different parameters
(`{registry, codec, relationName}` instead of `{source, relationaName}`).

Significant type overhaul, most generic types no longer require generics to be
explicitly passed in many circumstances. `PgSelectStep`, `PgSelectSingleStep`,
`PgInsertStep`, `PgUpdateStep` and `PgDeleteStep` now all accept the resource as
their single type parameter rather than accepting the 4 generics they did
previously. `PgClassExpressionStep` now accepts just a codec and a resource as
generics. `PgResource` and `PgCodec` have gained a new `TName extends string`
generic at the very front that is used by the registry system to massively
improve continuity of the types through all the various APIs.

Fixed various issues in schema exporting, and detect more potential
issues/oversights automatically.

Fixes an RBAC bug when using superuser role for introspection.
