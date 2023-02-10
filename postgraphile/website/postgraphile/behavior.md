# Behavior

For all but the simplest APIs you will want to control which parts of your data
sources are exposed and how they are exposed. New to PostGraphile version 5 is
the "behavior" system that gives you granular control over these topics.

## Terminology

A "behavior string" is a text-based string with a relatively simple syntax; here
are some examples:

- `insert`
- `+list -connection -list:filter`
- `-insert -update -delete root:*:filter +connection -list`

A behavior string is made of a list of "behavior fragments" separated by spaces.
Each behavior fragment optionally starts with a `+` or `-` symbol (if neither is
specified then `+` is inferred) followed by a "scope string." A scope string is
one or more "scope phrases" joined by colons (`:`). A scope phrase is either a
simple alphanumeric word (in camelCase), or an asterisk (`*`).

## Determining entity behavior

Many entities that PostGraphile processes when generating a schema (for example:
tables, columns, functions, types, etc.) have associated behaviors which
influence whether and how that entity is exposed. You may influence their
resulting behaviors by adding your own behavior strings to the entity, either
directly or via smart tags/smart comments. For example, if you don't want users
to be able to modify the `forums` table, you might add a database comment such
as `comment on table forums is '@behavior -create -update -delete';` (this is
just one of many ways of attaching behaviors).

The final behavior string of an entity is made by concatenating the behavior
strings from various sources; typically this follows the following pattern:

- Default behavior from the relevant plugin
- Global default behavior
- (Secondary entity behaviors)
  - E.g. if the entity is a column, then secondary entity behaviors may include
    the behavior of the data type of the column
- Entity behavior

The highest precedence behaviors are at the end the behavior string, and the
lowest priority behaviors are at the start.

When determining if an entity possesses a given "filter" behavior, the system
will scan backwards through the entity's behavior string for the first fragment
that matches the filter; if the matching fragment has a `-` modifier then the
entity does not possess that behavior (even if a positive fragment existed
earlier in the behavior string) otherwise it does.

## Global default behavior

If you want to make wide-sweeping changes to behaviors, you can add "default
behaviors" via the `build.behavior.addDefaultBehavior("...")` API. You should do
so during the `build` phase.

For example if you want your schema to use lists by default, eschewing the
superior connections pattern, you might use this plugin:

```js
const FavourListsPlugin = {
  name: "FavourListsPlugin",
  version: "0.0.0",
  schema: {
    hooks: {
      build(build) {
        build.behavior.addDefaultBehavior("-connection +list");
        return build;
      },
    },
  },
};
```

These global defaults can still be overridden by each entity, so they're a
really good way of making wide ranging "default" behaviors without locking
yourself in too hard.

## Core behaviors

**TODO**: We really need an automated registry of this, and to validate plugins
against it. But for now, this list will have to suffice.

The following are behaviors that the core
PostGraphile/graphile-build/graphile-build-pg plugins utilise:

- `select` - can select this source/column/etc. Note this does not necessarily
  mean you can do `select * from users` but it might mean that it's possible to
  see details about a `users` when it's returned by a function or similar. (In
  this case the `codec` has `select` but the `source` has `-select`.)
- `source:select` - can insert into this source
- `source:insert` - can insert into this source
- `source:update` - can update a record in this source
- `source:delete` - can delete a record in this source
- `source:list` - "list" field for a source at any level
- `source:connection` - "connection" field for a source at any level
- `attribute:select` - can this attribute be selected?
- `attribute:insert` - can this attribute be inserted into?
- `attribute:update` - can this attribute be updated?
- `attribute:base` - should we add this attribute to the "base" input type?
- `node` - should this source implement the GraphQL Global Object Identification
  specification
- `list` - list (simple collection)
- `connection` - connection (GraphQL Cursor Pagination Spec)
- `query:source:list` - "list" field for a source at the root Query level
- `query:source:connection` - "connection" field for a source at the root Query level
- `queryField` - for procedures: should it become a field on the `Query` type?
- `typeField` - for procedures: should it become a field on a non-operation
  type?
- `mutationField` - for procedures: should it become a mutation (field on
  `Mutation`)?
- `order` - can we sort this thing? (source)
- `query:source:list:order`
- `query:source:connection:order`
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

- `insert:input:record` - input to the 'insert' mutation
- `insert:payload:record` - the record added to the insert mutation payload
- `update:payload:record`

- `totalCount` - on a codec, should we add the `totalCount` field?

## Fragment matching algorithm

When determining if a fragment matches the filter, we use the following
algorithm:

ScopeMatches(fragment, filter):

- Let `filterPhrases` be `filter` split on `:`.
- Let `fragmentPhrases` be the scope of `fragment` split on `:`.
- If `fragmentPhrases` has more parts than `filterPhrases`, return false.
- Let `positive` be false if `fragment` starts with `-`, otherwise true.
- Make `fragmentPhrases` have the same length as `filterPhrases` by prepending
  the requisite number of `*` phrases to it.
- For each corresponding `filterPhrase` and `fragmentPhrase` in `filterPhrases`
  and `fragmentPhrases`:
  - If `filterPhrase` is `*`, `fragmentPhrase` is not `*`, and `positive` is
    false; return false.
  - If neither `filterPhrase` nor `fragmentPhrase` is `*` and they are not
    equal, return false.
- Return true.

Here's an annotated example of how `PgOrderAllColumnsPlugin` determines whether
it should allow ordering by a given column (attribute) of a codec:

```js
// Get the behaviors from the column type and the column itself
const behavior = getBehavior([pgCodec.extensions, column.extensions]);

// By default we want to enable orderBy, except when dealing with `array` and
// `range` types
const defaultBehavior = "orderBy orderBy:* -orderBy:array -orderBy:range";

// If the column behavior isn't a match then abort
if (!build.behavior.matches(behavior, "attribute:orderBy", defaultBehavior)) {
  return memo;
}
// If the column is an array and the behavior isn't a match then abort
if (
  column.codec.arrayOfCodec &&
  !build.behavior.matches(behavior, "attribute:orderBy:array", defaultBehavior)
) {
  return memo;
}
// If the column is a range and the behavior isn't a match then abort
if (
  column.codec.rangeOfCodec &&
  !build.behavior.matches(behavior, "attribute:orderBy:range", defaultBehavior)
) {
  return memo;
}
```

## Future expansions

Would be good to add additional data, e.g. `query:single[pk]`,
`query:single[node]`, `query:single[unique]` could all be be added, and would
allow you to set a rule like `-query:single +query:single[node]` to only allow
the node accessors.

## Behaviors to avoid

In order to avoid ambiguities, do not use:

- `create` - use `insert` instead
- `root:` - use `query:`, `mutation:` or `subscription:` instead
