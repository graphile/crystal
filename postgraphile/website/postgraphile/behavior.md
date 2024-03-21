# Behavior

For all but the simplest APIs you will want to control which parts of your data
sources are exposed and how they are exposed. New to PostGraphile version 5 is
the "behavior" system that gives you granular control over these topics.

## Terminology

A "behavior string" is a text-based string with a relatively simple syntax; here
are some examples:

- `insert`
- `+list -connection -list:filter`
- `-insert -update -delete query:*:filter +connection -list`

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
to be able to modify entries in the `forums` table, you might add a database
comment such as `comment on table forums is '@behavior -create -update
-delete';` (this is just one of many ways of attaching behaviors).

The final behavior string of an entity is made by concatenating the behavior
strings from various sources; typically this follows the following pattern:

- Default behaviors from plugins
- Global default behavior
- Inferred behaviors from plugins
- (Secondary entity behaviors)
  - E.g. if the entity is a column, then secondary entity behaviors may include
    the behavior of the data type of the column (codec)
- Entity behavior (from smart tags/smart comments)

The highest precedence behaviors are at the end the behavior string, and the
lowest priority behaviors are at the start.

When determining if an entity possesses a given "filter" behavior, the system
will scan backwards through the entity's behavior string for the first fragment
that matches the filter; if the matching fragment has a `-` modifier then the
entity does not possess that behavior (even if a positive fragment existed
earlier in the behavior string) otherwise it does.

## Global default behavior

If you want to make wide-sweeping changes to behaviors, you can add "default
behaviors" via the `preset.schema.defaultBehavior` setting. For example if you
want your schema to use lists by default, eschewing the more verbose (but
typically superior) connections pattern, you might have a configuration
something like this:

```js
// graphile.config.mjs

const preset = {
  //...
  schema: {
    //...
    defaultBehavior: "-connection +list",
  },
};

export default preset;
```

These global defaults can still be overridden by each entity, so they're a
good way of making wide ranging "default" behaviors without locking yourself in
too hard.

For example, if you want to run postgraphile with all behaviors disabled by default,
you can start your defaultBehavior string with `-*`. This would allow you to take the
approach of requiring intentional engineer decisions on how database schema additions
are reflected in your GraphQL schema.

:::info

If you're authoring a preset that is not the final configuration for a schema
then this default behavior setting is likely to be overridden (replaced) by the
user's configuration. Instead, preset authors should add a plugin that has a
`schema.globalBehavior` entry. If this entry is a string, the behavior will be
prepended. If it's a callback, then it should return an array of behavior
strings to be joined, one of which should be the current (passed in) behavior.
Typically you want a tuple where the first entry is your new behaviors and the
second entry is the current (passed-in) behavior (this way the user's
`defaultBehavior` will have higher precedence to your `globalBehavior`).

A similar "lists by default" plugin might look like this:

```js
const FavourListsPlugin = {
  name: "FavourListsPlugin",
  version: "0.0.0",
  schema: {
    globalBehavior: "-connection +list",
  },
};
```

or, equivalently, like this:

```js
const FavourListsPlugin = {
  name: "FavourListsPlugin",
  version: "0.0.0",
  schema: {
    globalBehavior(currentBehavior, resolvedPreset) {
      return ["-connection +list", currentBehavior];
    },
  },
};
```

:::

## Core behaviors

**TODO**: We really need an automated registry of this, and to validate plugins
against it. But for now, this list will have to suffice.

:::note

Scopes are least specific on the right (broad operations like `select` or
`update`) and narrow more as prefixes are added to the left (`resource:update`
is narrower than `update`; `constraint:resource:update` is narrower still).

:::

The following are behaviors that the core
PostGraphile/graphile-build/graphile-build-pg plugins utilise:

- `select` - can select this resource/column/etc. Note this does not necessarily
  mean you can do `select * from users` but it might mean that it's possible to
  see details about a `users` when it's returned by a function or similar. (In
  this case the `codec` has `select` but the `resource` has `-select`.)
- `resource:select` - can select rows from this resource
- `insert:resource:select` - can select the row that was inserted (on the mutation payload)
- `update:resource:select` - can select the row that was updated (on the mutation payload)
- `delete:resource:select` - can select the row that was deleted (on the mutation payload)
- `delete:resource:nodeId` - can select the nodeId of the row that was deleted (on the mutation payload)
- `resource:insert` - can insert into this resource
- `resource:update` - can update a record in this resource
- `resource:delete` - can delete a record in this resource
- `resource:list` - "list" field for a resource at any level
- `resource:connection` - "connection" field for a resource at any level
- `constraint:resource:update` - can update a record by this constraint
- `constraint:resource:delete` - can delete a record by this constraint
- `nodeId:resource:update` - can update a record by its NodeID
- `nodeId:resource:delete` - can delete a record by its NodeID
- `attribute:select` - can this attribute be selected?
- `attribute:insert` - can this attribute be inserted into?
- `attribute:update` - can this attribute be updated?
- `attribute:base` - should we add this attribute to the "base" input type?
- `nodeId:insert` - can we insert to the columns represented by this nodeId which represents a table related via foreign key constraint?
- `nodeId:update` - can we update the columns represented by this nodeId which represents a table related via foreign key constraint?
- `nodeId:base` - should we add a nodeId input representing this foreign key constraint to the "base" input type?
- `type:node` - should the GraphQLObjectType (`type`) this codec represents
  implement the GraphQL Global Object Identification specification
- `interface:node` - should the GraphQLInterfaceType (`interface`) this codec
  represents implement the GraphQL Global Object Identification specification
- `list` - list (simple collection)
- `connection` - connection (GraphQL Cursor Pagination Spec)
- `query:resource:list` - "list" field for a resource at the root Query level
- `query:resource:connection` - "connection" field for a resource at the root Query level
- `query:interface:list` - "list" field for a interface at the root Query level
- `query:interface:connection` - "connection" field for a interface at the root Query level
- `queryField` - for procedures: should it become a field on the `Query` type?
- `typeField` - for procedures: should it become a field on a non-operation
  type?
- `queryField:resource:connection` - should we represent this resource with a connection on the `Query` type?
- `queryField:resource:list` - should we represent this resource with a list on the `Query` type?
- `typeField:resource:connection` - should we represent this resource with a connection on a non-operation type
- `typeField:resource:list` - should we represent this resource with a list on a non-operation type
- `mutationField` - for procedures: should it become a mutation (field on
  `Mutation`)?
- `order` - can we sort this thing? (resource)
- `query:resource:list:order`
- `query:resource:connection:order`
- `orderBy` - can we order by this thing (e.g. column)?
- `proc:orderBy` - can we order by the result of this proc (function resource)?
- `attribute:orderBy` - can we order by this attribute (column, property)?
- `filterBy` - can we filter by this thing (e.g. column, table, etc)?
- `proc:filterBy` - can we filter by the result of this proc (function resource)
- `attribute:filterBy` - can we filter by this attribute (column, property)?
- `condition:attribute:filterBy` - can we filter by this attribute (column, property) in the `condition` argument?
- `single` - can we get just one?
- `query:resource:single` - can we get a single one of these (resource) at the root?
- `singularRelation:resource:single` - can we get a single one of these (resource) from a
  type?
- `singularRelation:resource:list` - should we add a list field to navigate this singular
  relationship (when we know there can be at most one)?
- `singularRelation:resource:connection` - should we add a connection field to navigate
  this singular relationship (when we know there can be at most one)?
- `manyRelation:resource:list`
- `manyRelation:resource:connection`
- `jwt` - should the given codec behave as if it were a JWT?
- `insert:input:record` - input to the 'insert' mutation
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

## Future expansions

Would be good to add additional data, e.g. `query:resource:single[pk]`,
`query:resource:single[node]`, `query:single[unique]` could all be be added, and would
allow you to set a rule like `-query:resource:single +query:single[node]` to only allow
the node accessors.

## Behaviors to avoid

In order to avoid ambiguities, do not use:

- `create` - use `insert` instead
- `root:` - use `query:`, `mutation:` or `subscription:` instead

## Setting and consuming behaviors in a plugin

TODO: document this.

```ts
const MyPlugin = {
  name: "MyPlugin",
  version: "0.0.0",

  schema: {
    // Register default behaviors (optional)
    entityBehaviors: {
      // Apply 'myCodecBehavior' by default to _all_ codecs
      pgCodec: "myCodecBehavior",

      // Apply 'myResourceBehavior' to resources with truthy `isUnique` (overrides defaults)
      pgResource(behavior, resource) {
        if (resource.isUnique) {
          return [behavior, "myResourceBehavior"];
        } else {
          return behavior;
        }
      },
    },

    // Do something with behaviors (optional)
    hooks: {
      GraphQLObjectType_fields_field(field, build, context) {
        const codec = context.scope.pgFieldCodec;
        if (
          !codec ||
          !build.behavior.pgCodecMatches(codec, "myCodecBehavior")
        ) {
          return field;
        }

        // Behavior matches! Do stuff here...

        return field;
      },
    },
  },
};
```
