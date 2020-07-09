# graphile-crystal

GraphQL's planning problem: solved.

## Restrictions

For Graphile Crystal to work, you need to adhere to the following restrictions:

- schema:
  - every resolver must be wrapped in crystal; this can be achieved manually, or
    by calling `enforceCrystal(schema)`
- during execution:
  - `context` must be an object (anything suitable to be used as the key to a
    `WeakMap`)
  - `rootValue` must be an object or `null`/`undefined`
  - `variables` must be an object or `null`/`undefined` (which GraphQL requires
    anyway)
  - None of the above may be a scalar
  - Do not provide `fieldResolver` (i.e. don't try and override the default
    field resolver)

## Advice

To reap the most benefit from using Graphile Crystal, you want as little to
change between executions as possible. In particular, this means you should:

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
