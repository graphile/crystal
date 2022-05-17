# Behaviors:

We really need an automated registry of this, and to validate plugins against
it. But for now, this list will have to suffice.

- `select` - can select this source/column/etc. Note this does not necessarily
  mean you can do `select * from users` but it might mean that it's possible to
  see details about a `users` when it's returned by a function or similar. (In
  this case the `codec` has `select` but the `source` has `-select`.)
- `insert` - can insert into this source/column/etc
- `update` - can update this source/column/etc
- `delete` - can delete this source
- `attribute:select` - can this attribute be selected?
- `attribute:insert` - can this attribute be inserted into?
- `attribute:update` - can this attribute be updated?
- `attribute:base` - should we add this attribute to the "base" input type?
- `node` - should this source implement the GraphQL Global Object Identification
  specification
- `list` - list (simple collection)
- `connection` - connection (GraphQL Cursor Pagination Spec)
- `query:list` - "list" field for a source at the root Query level
- `query:connection` - "connection" field for a source at the root Query level
- `query_field` - for procedures: should it become a field on the `Query` type?
- `type_field` - for procedures: should it become a field on a non-operation
  type?
- `mutation_field` - for procedures: should it become a mutation (field on
  `Mutation`)?
- `order` - can we sort this thing? (source)
- `query:list:order`
- `query:connection:order`
- `orderBy` - can we order by this thing (e.g. column)?
- `orderBy:array` - can we order by this thing that's an array?
- `orderBy:range` - can we order by this thing that's a range?
- `attribute:orderBy` - can we order by attribute (column, property)?
- `attribute:orderBy:array`
- `attribute:orderBy:range`
- `filterBy` - can we filter by this thing (e.g. column, table, etc)?
- `proc:filterBy` - can we filter by this proc (source)
- `attribute:filterBy` - can we filter by this attribute (column, property)
- `single` - can we get just one?
- `query:single` - can we get a single one of these (source) at the root?
- `singularRelation:single` - can we get a single one of these (source) from a
  type?
- `singularRelation:list` - should we add a list field to navigate this singular
  relationship (when we know there can be at most one)?
- `singularRelation:connection` - should we add a connection field to navigate
  this singular relationship (when we know there can be at most one)?
- `manyRelation:list`
- `manyRelation:connection`
- `jwt` - should the given codec behave as if it were a JWT?

# FORBIDDEN:

- `create` - use `insert` instead!
- `root:` - use `query:`, `mutation:` or `subscription:` instead
