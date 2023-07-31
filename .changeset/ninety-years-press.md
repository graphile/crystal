---
"graphile-build-pg": patch
"postgraphile": patch
---

Fix inflection of computed column field names in secondary schemas when using
the V5 preset. Also, use underscores instead of dashes for the
serviceName/schemaName separator for the names of the function resources, so
that they can be typed manually rather than having to use string properties like
`const { ["myService-mySchema-my_function_name"]: myFunctionResource } = pgRegistry.pgResources`
