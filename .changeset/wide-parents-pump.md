---
"postgraphile": patch
"grafast": patch
---

Fix types for abstract type's `planType` method:

1. `AbtractTypePlan`'s `TSpecifier` generic is now the first generic parameter
   (previously second) and now represents the specifier _data_, not the _step_.
2. Existence of `planType`'s second parameter (`info`) is now reflected in the
   types.
3. The same changes are made for `UnionPlan` and `InterfacePlan`.

If you were using `graphql-codegen-grafast`, be sure to update to the latest
version and regenerate the types so these changes are reflected.
