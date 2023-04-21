---
sidebar_position: 3
---

# Using with existing schema

## Requirements

To run an existing GraphQL schema with <grafast /> you must ensure that the
following hold:

- Your resolvers are built into your schema as is the norm (not passed via `rootValue`)
- If any of your resolvers use `GraphQLResolveInfo` (the 4th argument to the
  resolver) then they must not rely on `path` since we can't currently populate
  that in an equivalent fashion
- `context` must be an object (anything suitable to be used as the key to a
  `WeakMap`); if you do not need a context then `{}` is perfectly acceptable
- `rootValue`, if specified, must be an object or `null`/`undefined`

## Installation

Ensure that you have both the `graphql` and `grafast` modules installed:

```bash npm2yarn
npm install grafast graphql
```

## Running

Replace any calls to graphql.js' `graphql` or `execute` functions with Grafast's
`grafast` and `execute` respectively.

```diff
-import { graphql, execute } from 'graphql';
+import { grafast, execute } from 'grafast';

-const result = await graphql({
+const result = await grafast({
   schema,
   contextValue: {},
   source: ...
```

## Cache parse and validation

At this point you should be able to execute your GraphQL API as you previously
did, but we're not yet as optimal as we could be. If you use `execute` directly
then it's likely that you'll be planning each request every time, rather than
reusing operation plans. To solve this, you should cache the parsing of the
GraphQL request. You can either handle this yourself, use the `grafast` method,
or use a server/framework that does this for you; see [Servers][].

## Replacing resolvers with plans

&ZeroWidthSpace;<grafast /> automatically supports resolvers (with the
"Requirements" mentioned above) to help maintain compatibility with legacy
schemas, but if you're ready to get the next level of performance you can
replace the resolver with a plan on a field-by-field basis in a schema.

For more information, see [Plan Resolvers](../plan-resolvers).

[servers]: ../servers
