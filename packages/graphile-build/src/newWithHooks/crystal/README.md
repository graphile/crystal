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

For the following query:

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

For the field `friends`,

- `PathIdentity` is the unique path through this document describing this
  specific field using only concrete types; in this case something like
  `Query.allUsers>User.friends`
- `children` are the fields referenced in the child selection set, e.g. `id` and
  `name`
- `parent` refers to the field the containing selection set is applied to
- `counterparts` refers to, during resolution, the other instances of the
  `friends` field's resolver at this location (`PathIdentity`) in the document
