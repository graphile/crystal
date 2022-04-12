# DataPlanner

_**A cutting-edge planning and execution engine for GraphQL**_

DataPlanner understands GraphQL and (with your help) it understands your
business logic; this allows it to orchestrate a GraphQL request's data
requirements in an extremely efficient manner, leading to excellent performance,
reduced server load, and happier customers.

DataPlanner can be used as an alternative to the "execute" method of GraphQL.js
for the very best performance results, or can be used from within the "execute"
method via our automatic resolver-planner bridging (you can install this into an
existing schema with the `enforceCrystal` method below).

When DataPlanner sees a GraphQL request for the first time it will "plan" the
request: figuring out the data requirements, the steps that need to be taken,
and how to write the results to the response. This "first draft" plan will be
optimised and rewritten to give the best achievable performance (for example
removing redundant or duplicate processing steps, rewriting and merging
processing steps, etc). Finally, the plan will be executed, and the data
returned to the client. Future requests that are compatible with this plan can
be executed immediately without a need to re-plan.

## Requirements

DataPlanner can be used with any GraphQL.js schema that matches the following
requirements:

- GraphQL.js v16+
- every resolver in the schema must[1] be wrapped with DataPlanner's resolver
  wrapper; this can be achieved manually, or by calling `enforceCrystal(schema)`
- you must not override the default GraphQL field resolver
- for every request:
  - `context` must be an object (anything suitable to be used as the key to a
    `WeakMap`); if you do not need a context then `{}` is perfectly acceptable
  - `rootValue` must be an object or `null`/`undefined`

[1]: this isn't strictly true, but not doing this comes with some lengthy
caveats I have not yet documented.

## Advice

To reap the most benefit from using DataPlanner, you want as little to change
between executions as possible. In particular, this means you should:

- Cache (e.g. with a LRU cache) the parsed GraphQL document, so the same AST can
  be reused over and over for the same document
- Cache (e.g. with a LRU cache) the GraphQL `context` object, so the same
  context can be reused over and over for the same user
- Don't use `rootValue` (Do you really need it? Use `context` instead.)
- Where possible, memoize the variables object (e.g. using a cache over
  `canonicalJSONStringify(variables)`) so the same variables results in the same
  object in memory

## API

### `enforceCrystal(schema)`

Ensures every resolver in `schema` is wrapped in crystal. BEWARE - do not do
this if resolvers may already be wrapped, dual-wrapping resolvers will result in
hard-to-find bugs. This is particularly relevant if you're using other libraries
that modify a schema after it was created, such as `graphql-shield`.

TODO: mutate or return derivative?
