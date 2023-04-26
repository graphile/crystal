---
"graphile-config": patch
---

AsyncHooks can now execute synchronously if all registered hooks are
synchronous. May impact ordering of fields/types in GraphQL schema.
