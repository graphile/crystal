---
"graphile-build": patch
"postgraphile": patch
"@dataplan/pg": patch
---

Previously we used `rootValue()` to represent the Query type; but in GraphQL.js
rootValue can be null/undefined. Typically you just need a truthy value, so we
now use an empty object.
