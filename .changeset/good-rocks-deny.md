---
"graphile-build": patch
---

Fix bug where creating the build object also initialized it; this is incorrect
since if you just want the build object you don't necessarily want to register
all of the GraphQL types (and potentially discover naming conflicts) at that
moment. Introduced new
`schemaBuilder.initBuild(schemaBuilder.createBuild(input))` API to explicitly
handle initing if you need an initialized build object.
