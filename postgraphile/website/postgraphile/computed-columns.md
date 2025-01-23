---
title: Computed Columns
---

"Computed columns" add what appears to be an extra column (field) to the GraphQL
table type, but, unlike an actual column, the value for this field is the result
of calling a function defined in the PostgreSQL schema. This function will
automatically be exposed to the resultant GraphQL schema as a field on the type;
it can accept arguments that influence its result, and may return either a
scalar, record, list or a set. Sets (denoted by `RETURNS SETOF ...`) are exposed
as [connections](./connections) or lists, depending on the behavior configuration.

:::tip

We inline these function calls into the original `SELECT` statement for
efficiency, so no additional SQL queries need to be issued to the database.
That said, SQL function calls do have a performance overhead, which can build
up if you're doing this on thousands of rows. PostgreSQL can [sometimes inline
your SQL functions](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions)
for great performance, but if this fails and you're seeing performance issues
you might want to investigate using
[`makeExtendSchemaPlugin`](./make-extend-schema-plugin) instead.

:::

To create a function that PostGraphile will recognize as a computed column, it
must obey the following rules:

- adhere to
  [common PostGraphile function restrictions](./function-restrictions)
- name must begin with the name of the table it applies to, followed by an
  underscore (`_`)
- first parameter must be the table type
- must NOT return `VOID`
- must be marked as `STABLE` (or `IMMUTABLE`, though that tends to be less
  common)
- must be defined in the same PostgreSQL schema as the table

For example, assuming a table called `person` exists, the function:

```sql
CREATE FUNCTION person_full_name(person person) RETURNS text AS $$
  SELECT person.given_name || ' ' || person.family_name
$$ LANGUAGE sql STABLE;
```

Will create a computed column for your table named `person`, which can be
queried like this:

```graphql {5}
{
  personById(id: …) {
    # nodeId, id, ...

    fullName # A computed column, but the client doesn’t even know!
  }
}
```

### Example

This example creates two computed columns, one returning a simple varchar and
the other a connection. Note that `||` in PostgreSQL is string concatenation.

```sql {14-17,20-27}
create table my_schema.users (
  id serial not null primary key,
  first_name varchar not null,
  last_name varchar not null
);

create table my_schema.friendships (
  user_id integer not null,
  target_id integer not null,
  primary key (user_id, target_id)
);

-- Creates `User.name` string field
create function my_schema.users_name(u my_schema.users)
returns varchar as $$
  select u.first_name || ' ' || u.last_name;
$$ language sql stable;

-- Creates `User.friends` connection
create function my_schema.users_friends(u my_schema.users)
returns setof my_schema.users as $$
  select users.*
  from my_schema.users
  inner join my_schema.friendships
  on (friendships.target_id = users.id)
  where friendships.user_id = u.id;
$$ language sql stable;
```

You can add parameters to your computed column field by declaring additional
parameters in your PostgreSQL function:

```sql {1,4}
-- Creates `User.greet(greeting: String)` string field
create function my_schema.users_greet(
  u my_schema.users,  --- required table type parameter, unexposed
  greeting text       --- additional parameter, will be exposed
) returns text as $$
  select greeting || ', ' || u.first_name || ' ' || u.last_name || '!';
$$ language sql stable strict;
```

which can be queried like:

```graphql {3}
{
  userById(id: …) {
    greet(greeting: "Greetings and salutations")
  }
}
```

### Advice

See the advice in [the Custom Queries article](./custom-queries/#advice).
