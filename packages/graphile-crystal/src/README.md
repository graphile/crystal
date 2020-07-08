# Crystal

Crystal is Graphile Engine v5's lookahead engine. It takes the lessons learned
from Graphile Engine v4 and completely rebuilds the lookahead engine with the
following goals in mind:

- Increased performance
- Easier to understand
- Easier to write lookahead code
- Easier to debug
- More flexible

## Glossary

The following query may be referenced in the glossary

```graphql
{
  allUsers {
    id
    name
    friends(first: 5, condition: { nearby: true }) {
      id
      name
    }
  }
}
```

- `PathIdentity` is the unique path through this document describing this
  specific field using only concrete types; in the case of `friends` it would be
  something like `Query.allUsers>User.friends`
- `children` are the fields referenced in a child selection set, e.g. for the
  `friends` field the `children` would be `id` and `name`
- `parent` refers to the field the containing selection set is applied to, e.g.
  for the `friends` field, the `parent` would be `allUsers`
- `counterparts` refers to, during resolution, the other instances of a field's
  resolver at this `PathIdentity` within the document, e.g. for the `friends`
  field it would be all the instances of the `friends` resolver, one for each
  user returned from `allUsers`.
- `Doc` represents a GraphQL document within a specific instance of the schema;
  this allows for optimizations when the same document is used multiple times
  (as in the case of static queries). It's highly recommended that you use a
  GraphQL server that caches query parse results (such as PostGraphile) so you
  can leverage this optimization.
- `Aether` refers to the context within which resolvers run; generally you can
  think of this as a single call to `graphql(...)` but calls to `graphql(...)`
  that share the same schema, document, rootValue, context and variables may
  result in the same Aether.
- `Batch` represents a grouped execution of related fields and their plans;
  there may be one Batch for the entire document, or multiple batches within the
  document. Each field can belong to at most one batch during runtime.
- `BatchRoot` is the `PathIdentity` at the root of a particular Batch
  (incidentally the smallest PathIdentity within the batch). Where the entire
  GraphQL document is executed in one batch this may be the empty string.
  Directives such as `@stream` and `@defer` may define their own batch roots.
- `CrystalResult` contains the final data and more contextual information; it
  can be used to generate the result from the relevant resolver.
