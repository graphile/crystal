---
layout: page
path: /postgraphile/functions/
title: Database Functions
---

One of the easiest ways to add more capabilities to your PostGraphile schema is
with PostgreSQL functions. The three main methods are:

- [Computed Columns](./computed-columns/) enable you to add a computed field to
  a table type
- [Custom Queries](./custom-queries/) enable you to add a root level Query field
  which can return a scalar, list, custom type, table row or even a table
  connection
- [Custom Mutations](./custom-mutations/) enable you to add a root level
  Mutation field which can cause modifications to your database and return
  nothing (`void`), a scalar, list, custom type, table row or list of table rows
  (but not a connection, since you cannot paginate over a mutation)

### Understanding Functions

In order to make the most powerful PostGraphile server you can, it's very
important to understand PostgreSQL functions. Functions allow you to define
business logic in the database using SQL or one of many other scripting
languages. Putting your business logic in the database will often be more
performant then doing so in the application layer as PostgreSQL is finely tuned
for data intensive uses.

For some function examples, you can refer to the [forum example SQL schema][].

[forum example sql schema]: https://github.com/graphile/postgraphile/blob/v4/examples/forum/schema.sql

### Recommended Reading

- PostgreSQL [`CREATE FUNCTION`][] documentation for actually creating
  functions.
- PostgreSQL [`CREATE TRIGGER`][] documentation.
- StackOverflow answer describing [computed columns in PostgreSQL][].

[`create function`]: http://www.postgresql.org/docs/current/static/sql-createfunction.html
[`create trigger`]: http://www.postgresql.org/docs/current/static/sql-createtrigger.html
[computed columns in postgresql]: http://stackoverflow.com/a/11166268/1568890

### Procedural Languages

Functions in PostgreSQL require you to use either SQL or a procedural language.
The most common procedural language in PostgreSQL is [PL/pgSQL][pl/pgsql]. SQL
is probably the easiest to use as you are most likely already familiar with it.
PL/pgSQL is PostgreSQL’s custom procedural language, it's fairly easy to pick up
and there are plenty of StackOverflow and other resources for this language.
You’ll need to learn PL/pgSQL (or one of the other procedural languages) if you
want to write any triggers, because SQL can’t be used for triggers. Don’t
worry - you can definitely make awesome applications without a deep knowledge of
PL/pgSQL.

A simple function written with `LANGUAGE sql` looks like this:

```sql
CREATE FUNCTION add(a int, b int) RETURNS int AS $$
  select a + b;
$$ LANGUAGE sql IMMUTABLE STRICT;
```

The same function with `LANGUAGE plpgsql` could look like this:

```sql
CREATE FUNCTION add(a int, b int) RETURNS int AS $$
BEGIN
  RETURN a + b;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;
```

If you don’t want to use PL/pgSQL or SQL, many popular scripting languages can
be used _inside_ PostgreSQL to write your functions! You can see a few of these
projects here:

- [JavaScript (plv8)][]
- [Ruby (plruby)][]

For example, a function defined using JavaScript could look like:

```sql
-- This does look the exact same as the PL/pgSQL example…
CREATE FUNCTION add(a int, b int) RETURNS int AS $$
  return a + b;
$$ LANGUAGE plv8 IMMUTABLE STRICT;

-- Here’s a better example from the plv8 repo…
CREATE FUNCTION plv8_test(keys text[], vals text[]) RETURNS text AS $$
  var object = {}
  for (var i = 0; i < keys.length; i++) {
    object[keys[i]] = vals[i]
  }
  return JSON.stringify(object)
$$ LANGUAGE plv8 IMMUTABLE STRICT;
```

[pl/pgsql]: http://www.postgresql.org/docs/current/static/plpgsql.html
[javascript (plv8)]: https://github.com/plv8/plv8
[ruby (plruby)]: https://github.com/knu/postgresql-plruby

### Named Arguments

PostgreSQL allows you to mix named and positional (unnamed) arguments in your
functions. However, GraphQL will _only_ allow named arguments. So if you don’t
name an argument, PostGraphile will give it a name like `arg1`, `arg2`, `arg3`,
and so on. An example of a function with unnamed arguments is as follows:

```sql
CREATE FUNCTION add(int, int) RETURNS int AS $$
  SELECT $1 + $2;
$$ LANGUAGE sql IMMUTABLE STRICT;
```

Whereas named arguments look like:

```sql
CREATE FUNCTION add(a int, b int) RETURNS int AS $$
  select a + b;
$$ LANGUAGE sql IMMUTABLE STRICT;
```

### Solving naming conflicts

Sometimes the names you have chosen for your function parameters will conflict
with names of columns or other identifiers accessible within your function.

To avoid these conflicts you can use
[numeric arguments](https://www.postgresql.org/docs/current/xfunc-sql.html#XFUNC-SQL-FUNCTION-ARGUMENTS)
such as `$1` for the first argument, `$2` for the second, and so on, and use the
table name to disambiguate:

```sql
create function get_user(id int) returns users as $$
  select * from users where users.id = $1;
$$ language sql stable;
```

Alternatively, if you prefer to use the argument names rather than the numeric
`$n` arguments, you may use the function's name to disambiguate:

```sql
create function get_user(id int) returns users as $$
  select * from users where users.id = get_user.id;
$$ language sql stable;
```

This works well in general, but there are some cases where it is not enough. For
example when you have an upsert (`INSERT...ON CONFLICT`) statement in a
`plpgsql` language function, such as:

```sql
create function upsert_value(id int, value text) returns void as $$
begin
  insert into my_table (id, value)
    values(id, value)
    on conflict (id) -- This will error
    do update set value = excluded.value;
end;
$$ language plpgsql volatile;
```

In this case the `on conflict (id)` causes an issue because PL/pgSQL does not
know if `id` refers to the table column or the function argument, and adding the
table name inside the parenthesis is a syntax error.

To solve this, you can change language to `sql` which will treat columns
preferentially. Alternatively you can tell the function to solve conflicts by
using the column:

```sql
create function upsert_value(id int, value text) returns void as $$
#variable_conflict use_column
begin
  insert into my_table (id, value)
    values(id, value)
    on conflict (id)
    do update set value = excluded.value;
end;
$$ language plpgsql volatile;
```

To better understand these conflicts and solutions, refer to the PostgreSQL docs
for
[variable substitution](https://www.postgresql.org/docs/current/plpgsql-implementation.html#PLPGSQL-VAR-SUBST).

### VOLATILE (Mutation) Functions

By default, a function is “volatile”. For example, a function defined as:

```sql
CREATE FUNCTION my_function(a int, b int) RETURNS int AS $$ … $$ LANGUAGE sql;
```

Is equivalent to a function defined as:

```sql
CREATE FUNCTION my_function(a int, b int) RETURNS int AS $$ … $$ LANGUAGE sql VOLATILE;
```

From the PostgreSQL docs:

> `VOLATILE` indicates that the function value can change even within a single
> table scan, so no optimizations can be made… But note that any function that
> has side-effects must be classified volatile, even if its result is quite
> predictable, to prevent calls from being optimized away; an example is
> `setval()`.

In simpler terms `VOLATILE` basically means you are changing data or storing
state.

Anyone familiar with HTTP could compare a `VOLATILE` function to “unsafe” HTTP
methods like `POST`, `PUT`, `PATCH`, and `DELETE`.

Certain VOLATILE functions will be exposed by PostGraphile as
[custom mutations](./custom-mutations/).

### STABLE/IMMUTABLE (Query) Functions

If your function does not modify any data or state, you should declare it as
`STABLE`. (If your function depends only on its arguments and does not fetch
data from other sources such as tables, then you can declare it as `IMMUTABLE`
which is a stricter form of `STABLE`.)

By marking your function as `STABLE` or `IMMUTABLE`, PostgreSQL knows that it
can apply a number of optimisations, including memoization to avoiding calling
it multiple times for the same inputs during the same statement.

Here's examples of defining functions as STABLE/IMMUTABLE:

```sql
CREATE FUNCTION my_function(a int, b int) RETURNS int AS $$ … $$ LANGUAGE sql STABLE;

-- or…

CREATE FUNCTION my_function(a int, b int) RETURNS int AS $$ … $$ LANGUAGE sql IMMUTABLE;

-- or if you wanted to return a row from a table…

CREATE FUNCTION my_function(a int, b int) RETURNS my_table AS $$ … $$ LANGUAGE sql STABLE;
```

From the PostgreSQL docs:

> `IMMUTABLE` indicates that the function cannot modify the database and always
> returns the same result when given the same argument values; that is, it does
> not do database lookups or otherwise use information not directly present in
> its argument list. If this option is given, any call of the function with
> all-constant arguments can be immediately replaced with the function value.

and…

> `STABLE` indicates that the function cannot modify the database, and that
> within a single table scan it will consistently return the same result for the
> same argument values, but that its result could change across SQL statements.
> This is the appropriate selection for functions whose results depend on
> database lookups, parameter variables (such as the current time zone), etc.
> (It is inappropriate for AFTER triggers that wish to query rows modified by
> the current command).

To use the HTTP analogy again, `IMMUTABLE` and `STABLE` are comparable to “safe”
HTTP methods like `GET` and `HEAD`.

Certain STABLE/IMMUTABLE functions will be exposed by PostGraphile as
[custom queries](./custom-queries/) or [computed columns](./computed-columns/).

### SETOF Functions - Connections

As well as scalars, compound types, and arrays of these, PostgreSQL functions
can also return sets. Sets emulate tables, and so it's natural for PostGraphile
to expose these to GraphQL using [connections](./connections/).

SETOF functions can be a powerful way of exposing data to the user that may be
too much for them to handle all at once and require pagination.

To create a function that returns a connection, you could use SQL such as this:

```sql
-- Assuming we already have a table named `person`…
CREATE FUNCTION my_function(a int, b int) RETURNS SETOF person AS $$ … $$ LANGUAGE sql STABLE;
```

This function would be recognised as a [custom query](./custom-queries/), and
could be queried like this:

```graphql {2}
{
  myFunction(a: 1, b: 2, first: 2) {
    pageInfo {
      hasNextPage
      hasPrevPage
    }
    edges {
      cursor
      node {
        id
      }
    }
  }
}
```

More information on constructing advanced queries can be found
[here](./custom-queries/).

[forum example sql schema]: https://github.com/graphile/postgraphile/blob/v4/examples/forum/schema.sql

---

_This article was originally written by
[Caleb Meredith](https://twitter.com/calebmer) but has been heavily edited
since._
