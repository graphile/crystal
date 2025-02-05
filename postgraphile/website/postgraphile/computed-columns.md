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

:::tip Performance Note

We inline these function calls into the original `SELECT` statement for
efficiency, so no additional SQL queries need to be issued to the database.
That said, SQL function calls do have a performance overhead, which can build
up if you’re doing this on thousands of rows. PostgreSQL can [sometimes inline
your SQL functions](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions)
for great performance, but if this fails and you’re seeing performance issues
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

PostgreSQL's documentation on [function
calls](https://www.postgresql.org/docs/17/sql-expressions.html#SQL-EXPRESSIONS-FUNCTION-CALLS)
notes:

> A function that takes a single argument of composite type can optionally be
> called using field-selection syntax, and conversely field selection can be
> written in functional style. That is, **the notations `col(table)` and `table.col`
> are interchangeable**. This behavior is not SQL-standard but is provided in
> PostgreSQL because it allows use of functions to emulate “computed fields”.
>
> -- https://www.postgresql.org/docs/17/sql-expressions.html, emphasis added.

Thus to query this computed column yourself outside of PostGraphile you could
execute:

```sql {3,5}
select
  person.id,
  person.person_full_name as full_name
  -- or, equivalently:
  -- person_full_name(person) as full_name
from person
where id = $1;
```

This `person.person_full_name` syntax makes the function `person_full_name`
appear as if it were a column of `person` even though no such column exists,
hence our name for it: computed column function.

:::note Computed columns can also return sets

If your function, for example `person_favorite_posts(person)`, returns a set
then PostGraphile will automatically wrap this selection in a subquery
aggregation for you to prevent the parent query from yielding more rows than
expected; if you wanted to query it yourself it might look something like:

```sql {3-6}
select
  person.id,
  array(
    select posts.*
    from person_favorite_posts(person) posts
  ) as favorite_posts
from person
where id = $1;
```

:::

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
