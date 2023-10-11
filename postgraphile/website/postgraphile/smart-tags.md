---
layout: page
path: /postgraphile/smart-tags/
title: Smart Tags
---

You can customise your PostGraphile GraphQL schema by tagging tables, columns,
functions, relations, etc. These changes could be renaming something, omitting
things from your GraphQL schema, or anything else a plugin supports!

We call this functionality "Smart Tags" and it allows you to easily customise
the generated GraphQL schema without making breaking changes to your database.

If you're using PostGraphile in `--watch` mode, you should be able to see in
Ruru that the related types and fields will reflect the change almost
immediately. If you're not using `--watch` then you may need to restart the
server for smart tag changes to take effect.

## The @ character

We often refer to things like the `@behavior` smart tag or the `@name` smart
tag; really these tags are just `behavior` and `name` respectively; but in the
[Smart Comment](./smart-comments/) syntax (the oldest form of smart tags in
PostGraphile) the `@` is required to denote a smart tag, and this pattern has
stuck when referring to smart tags.

You will also often see the [smart comment
syntax](./smart-comments/#smart-comment-spec) used to refer to smart tags in
general, it's because the syntax is a little easier to write quickly. Read the
[Smart Comments Spec](./smart-comments/#smart-comment-spec) and you'll soon
learn to translate `@omit update,delete` to `omit: "update,delete"` (and
vice-versa) in your head.

## Valid values

Tags have a limited set of valid values:

- `true`
- a string
- an array of strings

Some tags only support one or two of these types of values.

## Ways of adding tags

There's multiple ways of adding tags to entities:

- The [postgraphile.tags.json5](./smart-tags-file/) file
- [Smart Comments](./smart-comments/) in the database via `COMMENT`
- A [`makePgSmartTagsPlugin`](./make-pg-smart-tags-plugin/) instance
- Your own [plugin](./extending-raw/); specifically:
  - implement the `gather.hooks.pgIntrospection_introspection` callback,
  - get the relevant entity,
  - call `entity.getTagsAndDescription()` on it,
  - mutate the resulting `.tags` property of the returned object.

## Example

_In this example we're going to use Smart Comments for brevity, but this works
with all the ways of adding smart tags._

Here is a basic table, with the name changed from `original_table` to
`renamed_table`:

```sql
create table original_table (
  col1 int
);

comment on table original_table is E'@name renamed_table';
```

The column can also be renamed:

```sql
comment on column original_table.col1 is E'@name colA';
```

The same can be done for types and custom queries:

```sql
create type flibble as (f text);

create function getFlamble() returns SETOF flibble as $$
    select (body)::flibble from post
$$ language sql;

comment on type flibble is E'@name flamble';
comment on function getFlamble() is E'@name allFlambles';
```

Smart comments are also reflected in GraphiQL. Here, we are querying the table
`original_table` by looking at `allOriginalTables`:

<div class="full-width">

![GraphiQL displaying allOriginalTables](./smart-comments-rename-example1.png)

</div>

Next, we add the smart comment `@name renamed_table` on `original_table` and the
rename is instantly reflected in GraphiQL:

<div class="full-width">

![GraphiQL displaying the renamed allOriginalTables](./smart-comments-rename-example2.png)

</div>

So now the query needs to use the new name for the table:

<div class="full-width">

![GraphiQL displaying allRenamedTables](./smart-comments-rename-example3.png)

</div>

:::info

These screenshots were taken in an early PostGraphile V4 GraphiQL. Though Ruru
in PostGraphile V5 will look different, the results are the same.

:::

## Non-exhaustive

Any plugin may implement support for smart tags, so refer to those plugins'
documentation for details of the smart tags they add.

The following are some of the smart tags built into PostGraphile:

## @deprecated

You can deprecate a database column using the `deprecated` tag. If you need
multiple lines, you can specify the tag multiple times, one per line of output
text.

Applies to:

- columns

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    attribute: {
      my_column: {
        tags: {
          deprecated: "Use myOtherColumn instead.",
        },
      },
    },
  },
}
```

```sql
comment on column my_schema.my_table.my_column is
  E'@deprecated Use myOtherColumn instead.';
```

## @name

You can add a smart tag to an entity to rename that entity. For tables, columns,
custom types and many functions you can use the `name` tag. For more complex
things we use different tags, such as for foreign key constraints we have
`fieldName` and `foreignFieldName`.

Applies to:

- Tables
- Views
- Materialized views
- Composite types (one direction only)
- Columns
- Types
- [Custom Query](./custom-queries/) functions: the `Query` field name
- [Custom Mutation](./custom-mutations/) functions: the `Mutation` field name

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    class: {
      post: {
        tags: {
          name: "message",
        },
      },
    },
    procedure: {
      search_posts: {
        tags: {
          name: "returnPostsMatching",
        },
      },
    },
  },
}
```

```sql
comment on table post is
  E'@name message';
comment on function search_posts(text) is
  E'@name returnPostsMatching';
```

## @fieldName

Applies to:

- foreign key constraints: the local field name for the relationship (see also
  `@foreignFieldName`)
- unique constraints: the root finder field name
- computed column functions: the field name this function creates

## @foreignFieldName

`foreignFieldName` applies to

- foreign key constraints: the field on the remote type (the "backwards"
  relation)

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    constraint: {
      "my_table.my_constraint": {
        tags: {
          foreignFieldName: "threads",
          fieldName: "author",
        },
      },
    },
  },
}
```

This name will be fed through the `connectionField` (by default does nothing)
or `listField` (by default appends 'List') inflector as appropriate. To
specifically override the name of the connection field, use
`@foreignConnectionFieldName`; and to specifically override the name of the
list field, use `@foreignSimpleFieldName`.

See also: `@fieldName`, `@foreignSimpleFieldName`, `@foreignConnectionFieldName`

### @foreignSimpleFieldName

`foreignSimpleFieldName` applies to _list_ fields generated from

- foreign key constraints: the field on the remote type (the "backwards"
  relation)

### @foreignConnectionFieldName

`foreignConnectionFieldName` applies to _connection_ fields generated from

- foreign key constraints: the field on the remote type (the "backwards"
  relation)

## @resultFieldName

Applies to:

- [Custom Mutation](./custom-mutations/) functions: the field on the mutation
  payload type

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    procedure: {
      authenticate: {
        tags: {
          name: "login",
          resultFieldName: "token",
        },
      },
    },
  },
}
```

```sql
comment on function authenticate(text, text) is
  E'@resultFieldName token\n@name login';
```

## @behavior

Use this smart tag to override the behavior associated with a table, view,
materialized view, type, column, constraint, function or other database entity.
See the [behavior documentation](./behavior.md).

```sql
comment on table users is
  E'@behavior -insert -delete';
```

## @arg0variant, @arg1variant, ...

When building a custom mutation, you probably want to use the composite type
that is generated when creating a table in PostgreSQL as a function argument,
like this (note this is just an example for illustrative purposes):

```sql
create table example(
  id uuid primary key,
  name text not null
);

create function new_example(input example) returns example as $$
  insert into example (id, name) values (input.id, input.name) returning *;
$$ language sql volatile;
```

By default, composite types will be translated into a GraphQL types by
PostGraphile with the same characteristics, i.e. all `not null` columns will
become non-nullable fields. You can let PostGraphile know that you want to
convert the composite type into another "variant" GraphQL type with a smart
comment. Variants include `patch` (which is equivalent to the argument to
`update*` mutations) and `base` (which makes every column both available
(ignores permissions) and nullable). For example:

```sql
create table example(
  id uuid primary key,
  name text not null
);

create function new_example_with_auto_id(input example) returns example as $$
  insert into example (id, name) values (gen_random_uuid(), input.name) returning *;
$$ language sql volatile;

comment on function new_example_with_auto_id(input example) is
  E'@arg0variant patch';
```

This uses the `patch` variant from PostGraphile's update mutations which has all
the fields except `id`. This will mean that the custom mutation will not ask for
the `id` on the client-side anymore (because it will generate it itself). Note
how `arg0` refers to the first function parameter (we use a 0-indexed counter of
the arguments), thus `arg2` would be the third parameter.

Applies to:

- Custom Query functions
- Custom Mutation functions
- Computed Column functions

## @ref

See [Refs](./refs)

### @refVia

See [Refs](./refs)

## Virtual constraints

You can add "virtual" (fake) constraints to types in PostgreSQL using smart
comments. The primary use case for this is to make views act more table-like -
allowing you to express the connections between tables and views. It's also
useful on composite types, especially for adding relationships.

### @notNull

Allows marking the column as non-nullable.

Applies to:

- columns

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    attribute: {
      "my_view.my_column": {
        tags: {
          notNull: true,
        },
      },
    },
  },
}
```

```sql
comment on column my_view.my_column is E'@notNull`;
```

### @primaryKey

Primary key columns will automatically be marked as `@notNull`, as they would in
PostgreSQL.

If you declare something as a primary key it _must_ be unique. We do not check
it's unique - we trust you - but if it isn't unique then we're not sure what
will happen...

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    class: {
      my_view: {
        tags: {
          primaryKey: "id",
          // or:
          //   primaryKey: "type,identifier"
        },
      },
    },
  },
}
```

```sql
comment on view my_view is E'@primaryKey id';
-- or
comment on view my_view is E'@primaryKey type,identifier';
```

### @foreignKey

The foreign key adds virtual constraints pretending to be foreign keys. It has
the following syntax which mirrors the PostgreSQL foreign key constraint:

`@foreignKey (col1, ...) references [my_schema.]my_table [(col1, ...)]`

In the tags file you must omit the leading `@foreignKey` text since it is
specified as the key (rather than the value) in the tags object ─ see example
below.

The schema is optional if the target table is in the same schema. If you're
referencing a Primary Key on the remote table/view then you can skip the final
column specification should you wish. Otherwise, you must reference columns
matching a unique constraint.

Applies to:

- Tables
- Views
- Materialized views
- Composite types (one direction only)

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    class: {
      my_materialized_view: {
        tags: {
          foreignKey: "(key_1, key_2) references other_table (key_1, key_2)",
        },
      },
    },
  },
}
```

```json5 title="postgraphile.tags.json5 (multiple foreign keys)"
{
  version: 1,
  config: {
    class: {
      my_materialized_view: {
        tags: {
          foreignKey: [
            "(key_1, key_2) references other_table (key_1, key_2)",
            "(key_3, key_4) references some_other_table (key_3, key_4)",
          ],
        },
      },
    },
  },
}
```

```sql
comment on materialized view my_materialized_view is E'@foreignKey (key_1, key_2) references other_table (key_1, key_2)';

-- or if you want multiple foreignKeys
comment on materialized view my_materialized_view is E'@foreignKey (key_1, key_2) references other_table (key_1, key_2)\n@foreignKey (key_3, key_4) references some_other_table (key_3, key_4)';
```

:::note

Fake constraints are treated as if they are indexed.

:::

### @unique

_From PostGraphile 4.9.1_

Introduces a "fake" unique constraint, so `@unique col1,col2` is somewhat
equivalent to the following, except it can also be applied to entities that
cannot have unique constraints, e.g. views. It is up to you to ensure that your
data is indeed unique on the given columns.

```sql
-- `@unique col1,col2` is roughly equivalent to:
ALTER TABLE foo ADD CONSTRAINT fake_unique UNIQUE (col1, col2);
```

More than one `@unique` tag may be specified.

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    class: {
      my_view: {
        tags: {
          unique: ["id", "org_id,slug"],
          // or:
          //   unique: "id"
        },
      },
    },
  },
}
```

```sql
comment on view my_view is E'@unique id\n@unique org,slug';
```

### Smart Tags on virtual constraints

You can also add smart tags on virtual constraints, for example adding the
`fieldName` smart tag to a virtual foreign key constraint, by appending the pipe
character `|` followed by the `@`-prefixed smart tag:

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    class: {
      my_materialized_view: {
        tags: {
          foreignKey: "(key_1, key_2) references other_table (key_1, key_2)|@fieldName field_1",
        },
      },
    },
  },
}
```

## Polymorphism

### @interface

See [Polymorphism](./polymorphism)

#### @type

See [Polymorphism](./polymorphism)

### @unionMember

See [Polymorphism](./polymorphism)

## Deprecated tags

These tags are only available if you're using the V4 preset, and have been replaced by better methods.

### @omit

_Deprecated: use `@behavior -*` instead._

To remove an entity from your API, you can use the 'omit' smart tag. If you only
want to omit the entity from certain operations you can list them. For example,
`@omit update` on a table would prevent the table from having an update-related
functionality whilst still including queries, create and delete. `@omit update`
on a column would prevent the column appearing in the `Patch` type, so it cannot
be updated (but can still be created) via GraphQL.

Here's a quick-reference for the operations we currently support (you'll want to
experiment with them as there wasn't space to put all the caveats in the
table!):

<div class='big-table'>

| ⁣   | Action        | Table effect            | Column effect         | Function effect      |
| --- | ------------- | ----------------------- | --------------------- | -------------------- |
| C   | **`create`**  | omit `create` mutation  | omit from `create`    | -                    |
| R   | **`read`**    | omit completely         | completely omitted    | -                    |
| U   | **`update`**  | omit `update` mutations | omit from `update`    | -                    |
| D   | **`delete`**  | omit `delete` mutations | -                     | -                    |
| F   | **`filter`**  | omit `condition` arg    | omit from `condition` | no filtering         |
| O   | **`order`**   | omit `orderBy` arg      | omit from `orderBy`   | no ordering          |
| A   | **`all`**     | no `allFoos` query      | -                     | -                    |
| M   | **`many`**    | no foreign key fields   | -                     | -                    |
| X   | **`execute`** | -                       | -                     | function not present |

</div>

> **Warning:** This functionality is not intended for implementing permissions,
> it's for removing things from your API that you don't need. You should back
> these up with database permissions if needed.

Multiple actions can be listed using commas (no spaces!), as in the following
example which disables mutations on a table:

```json5 title="postgraphile.tags.json5"
{
  version: 1,
  config: {
    class: {
      table_name: {
        tags: {
          omit: "create,update,delete",
        },
      },
    },
  },
}
```

```sql
comment on table table_name is E'@omit create,update,delete';
```

Applies to:

- Tables
- Views
- Materialized views
- Composite types (one direction only)
- Columns
- Custom Queries
- Custom Mutations
- Computed Columns
- Unique constraints
- Foreign key constraints

#### Example

On a simple table called `book` we have added a smart comment omitting the
`update` and `delete` operations:

```sql
create table forum_example.book (
  col1 int
);

comment on table forum_example.book is E'@omit update,delete';
```

The results are immediately reflected in GraphiQL. We can also disable `create`
operations:

```sql
comment on table forum_example.book is E'@omit create,update,delete';
```

On the left, you can see the documentation for all the fields and types
regarding `book` before the `create` operation was omitted. On the right, you
can see the reduced fields and types once the `create` operation is omitted.

![GraphiQL displaying an omit smart comment example](./smart-comments-omit-example.png)

### @simpleCollections

_Deprecated: use `@behavior +list +connection` instead, replacing `+` with `-`
for the features to disable._

You can control whether simple collections are enabled by default using
`--simple-collections omit|both|only` (or
`simpleCollections: "omit"|"both"|"only"`); however sometimes you want to
override this on a case by case setting - for example if you want relay
connections for almost all collections, except when it comes to a user's email
addresses where you want to use a simple list.

You can do this with the `@simpleCollections omit`, `@simpleCollections both`
and `@simpleCollections only` smart comments.

Applies to:

- Tables
- Views
- Materialized views
- Custom Query functions
- Computed Column functions

```sql
comment on table email is
  E'@simpleCollections both';
```

```sql
comment on constraint email_user_id_fkey on email is
  E'@simpleCollections both';
```

```sql
comment on function search_people(query text) is
  E'@simpleCollections both';
```

### @sortable

_Deprecated: use `@behavior +sort +sortBy` instead._

Since version
[v4.3.1](https://github.com/graphile/postgraphile/releases/tag/v4.3.1)

Applies to:

- Functions returning `SETOF` a table-like composite type (e.g. a table type,
  view, materialized view, etc, but _not_ a custom type): adds the `orderBy`
  argument to this connection, allowing to _sort_ the set by its
  columns/attributes.
- Computed column functions with no required parameters and returning a scalar
  or array: allows this function to be used as an order in the `orderBy`
  argument for the parent table, allowing to _sort_ the parent table _by_ this
  function's return value. parent table.

If used on a computed function that returns a SETOF _record type_ it will make
the connection _sortable_ (like it would with any other `SETOF` function) and
NOT a _sort by_ for its parent table

```sql
comment on function foo() is E'@sortable';
comment on function users_foo(users) is E'@sortable';
```

```graphql
{
  # If the function returns a set of table rows
  foo(orderBy: [ID_ASC]) { ... }
  user(nodeId: ...) {
    foo(orderBy: [ID_ASC]) { ... }
  }

  # If the function return a scalar
  allUsers(orderBy: [FOO_ASC]) { ... }
}
```

### @filterable

_Deprecated: use `@behavior +filter +filterBy` instead._

Since version
[v4.3.1](https://github.com/graphile/postgraphile/releases/tag/v4.3.1).

Applies to:

- Functions returning `SETOF` a table-like composite type (e.g. a table type,
  view, materialized view, etc, but _not_ a custom type): adds the `condition`
  argument to this connection, allowing to _filter_ the set by any of its scalar
  fields.
- Computed column functions with no required parameters and returning a scalar
  or array: allows this function to be used as field in the `condition` argument
  for the parent table, allowing to _filter by_ this function's value the parent
  table.

If used on a computed function that returns a SETOF _record type_ it will make
the connection _filterable_ (like it would with any other `SETOF` function) and
NOT a _filter by_ for its parent table

```sql
comment on function foo() is E'@filterable';
comment on function users_foo(users) is E'@filterable';
```

```graphql
{
  # If the function returns a set of table rows
  foo(condition: {firstName: "Alice"}) { ... }

  # If the function return a scalar
  allUsers(condition: {foo: "FOO_VALUE"}) { ... }
}
```

#### Sorting and filtering non-scalar computed columns

If your computed column is returning a composite type, the recommended approach
is to wrap it with a computed column that returns the scalar field you want to
sort and/or filter by. For example:

```sql
-- non scalar function
CREATE OR REPLACE FUNCTION user_object(user user) RETURNS object AS $$
SELECT * FROM object where id = user.object_id;
$$ language SQL STABLE;

-- wrapper. Note the () for notation. Failing to use them will throw an error
CREATE OR REPLACE FUNCTION user_object_field(user user) RETURNS varchar AS $$
SELECT (user_object(user)).field;
$$ language SQL STABLE;

-- don't forget the comments...
comment on function user_object_field() is E'@sortable';
```

Note that this will only work with a single composite type. If your computed
function returns a `SETOF` composite type one option is to use an `ARRAY` and
the
[connection-filter plugin](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter).

```sql
-- non scalar setof function
CREATE OR REPLACE FUNCTION user_objects(user user) RETURNS SETOF object AS $$
SELECT * FROM object where owner_id = user.id; -- one user, many objects
$$ language SQL STABLE;

-- wrapper. Note the () for notation. Failing to use them will throw an error
CREATE OR REPLACE FUNCTION user_object_fields(user user) RETURNS varchar[] AS $$
SELECT ARRAY_AGG((user_objects(user)).field);
$$ language SQL STABLE;

-- don't forget the comments...
comment on function user_object_fields() is E'@sortable';
```

Now you can use the array as a _filter by_, for example:

```graphql
{
  # get all users who own an object with field == 'foo'
  allUsers(filter: { object_fields: { contains: "foo" } }) {
    nodes {
      id
      # ...
    }
  }
}
```
