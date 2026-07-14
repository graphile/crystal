---
"graphile-build-pg": patch
"postgraphile": patch
---

Support overloaded computed column functions targeting different composite
types. Computed column functions that don't follow the
`${tableName}_${fieldName}` naming convention now have their resource name
prefixed with the composite type name (e.g. `code(pets)` and `code(buildings)`
become `pets_code` and `buildings_code`), so overloads no longer clash. The new
`functionResourceNameCompositeTypePrefix` inflector controls this prefix; by
default it only applies to functions in the same schema as their composite type;
override it to support cross-schema computed columns.
