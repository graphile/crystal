---
"graphile-utils": patch
"postgraphile": patch
"grafast": patch
---

In order to make the libraries more type safe, `makeGrafastSchema` (from
`grafast`) and `makeExtendSchemaPlugin` (from `postgraphile/utils`) have
deprecated the `typeDefs`/`plans` pattern since `plans` (like `resolvers` in the
traditional format) ended up being a mis-mash of lots of different types and
`__`-prefixed fields for special cases. Instead the configuration should be
split into `typeDefs` with `objects`, `interfaces`, `unions`, `inputObjects`,
`scalars` and `enums`; and object and input object fields should be specified
via the `plans` entry within themselves to avoid conflicts with
`resolveType`/`isTypeOf`/`planType`/`scope` and similar type-level (rather than
field-level) properties. This also means these type-level fields no longer have
the `__` prefix. Migration is quite straightforward:

```diff
 typeDefs: ...,
-plans: {
+objects: {
   User: {
-    __isTypeOf(v) {
+    isTypeOf(v) {
       return v.username != null;
     },
+    plans: {
       fieldName($source, fieldArgs) {
         // ...
       },
+    },
   },
+},
+interfaces: {,
   MyInterface: {
-    __resolveType($specifier) {
+    resolveType($specifier) {
       // ...
     }
   }
+},
+enums: {
   MyEnum: {
     ONE
     TWO
     THREE
   }
 },
```

Other changes:

- `ObjectPlans`/`GrafastPlans`/`FieldPlans`/`InputObjectPlans`/`ScalarPlans` all
  changed to signular
- `InterfaceOrUnionPlans` split to `InterfacePlan`/`UnionPlan` (identical
  currently)
- Shape of `ObjectPlan`/`InterfacePlan`/`UnionPlan` has changed;
  `DeprecatedObjectPlan`/etc exist for backcompat
- `FieldArgs` can now accept an input shape indicating the args and their types
- `FieldPlanResolver<TArgs, TParentStep, TResultStep>` has switched the order of
  the first two generic parameters:
  `FieldPlanResolver<TParentStep, TArgs, TResultStep>` - this is to reflect the
  order of the arguments to the function. Also null has been removed from the
  generics.
- Various generics (including `GrafastFieldConfig`) that used to take a GraphQL
  type instance as a generic parameter no longer do - you need to use external
  code generation because TypeScript cannot handle the dynamic creation.
- `GrafastFieldConfig` last two generics swapped order.
- `GrafastArgumentConfig` generics completely changed
