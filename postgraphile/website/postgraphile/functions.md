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

If you want to leverage database functionality rather than PostGraphile plugins
to enhance your API then it's very important to understand PostgreSQL
functions. Functions allow you to define business logic in the database using
SQL or one of many other scripting languages.

For some function examples, you can refer to the [forum example SQL schema][].

[forum example sql schema]: https://github.com/graphile/postgraphile/blob/v4/examples/forum/schema.sql

## Understanding function performance

Well written business logic in the database will often be significantly more
performant then writing the business logic in the application layer. This is
because PostgreSQL is finely tuned for data intensive uses.

:::info

It's _very easy_ to have very poor performance in the database if
you try and move your procedural programming language knowledge over without
making accomodations for the new paradigm you're in. In PostgreSQL, every
function call and every statement executed has a performance overhead, so if
you don't adapt your coding patterns to be optimal for a database, you will
likely get poor performance. This poor performance from poorly written database
functions is one of the reasons some critics claim that business logic in the
database should not be used.

:::

JavaScript programmers will likely be tempted to use the `FOR`, `FOREACH` and
`LOOP` constructs to manipulate rows, since that's what they would do in their
JavaScript code. But doing so might result in PostgreSQL having to perform
hundreds, thousands, or even millions of SQL queries and function calls under
the hood of your function.

In PostgreSQL you should **almost never** use these looping constructs, instead
you should perform set operations where possible.

### Example: archiving forums

Imagine you want a function capable of archiving a number of forums, and thus
set the `is_archived` for each post in that forum. You might do it like this:

```sql title="BAD! Don't do this!"
create function archive_forums(forum_ids int[]) returns void as $$
declare
  target_forum_id int;
begin
  /* BAD: looping should be avoided! */
  foreach target_forum_id in array forum_ids loop
    update forums set is_archived = true where id = target_forum_id;
    update posts set is_archived = true where forum_id = target_forum_id;
  end loop;
end;
$$ language plpgsql volatile;
```

If you feed in 100 values, then this would turn into executing 200 SQL queries.

A better approach would be to do bulk updates:

```sql title="More efficient"
create function archive_forums(forum_ids int[]) returns void as $$
  update forums set is_archived = true where id = ANY(forum_ids);
  update posts set is_archived = true where forum_id = ANY(forum_ids);
$$ language sql volatile;
```

If the mutation you made to a later table is dependent on values in an earlier
table then you could do it all in a single statement using a [common table
expression](https://www.postgresql.org/docs/current/queries-with.html):

```sql title="Single query example"
create function archive_forums(forum_ids int[]) returns void as $$
  with updated_forums as (
    update forums
    set is_archived = true
    where id = ANY(forum_ids)
    returning id
  )
    update posts
    set is_archived = true
    from updated_forums
    where posts.forum_id = updated_forums.id;
$$ language sql volatile;
```

### Example: row-level security function

Another common mistake that we see people make is passing row values to
function calls in RLS policies. For example:

```sql title="BAD! Uses row data in function call"
create function current_user_is_member_of(target_organization_id int) returns boolean as $$
  select exists(
    select 1
    from memebrs
    where organization_id = target_organization_id
    and user_id = current_user_id()
  );
$$ language sql stable security definer;

create policy select_members
  for select on members
  using (
    /* highlight-next-line */
    current_user_is_member_of(members.organization_id)
  );
```

Here each new value for `members.organization_id` is passed to the
`current_user_is_member_of` function, meaning that (depending on the other
filters used in the query) we may be calling the `current_user_is_member_of`
function for every unique `organization_id` in the database. And that's the best
case, at worst PostgreSQL may call the function for every row. Ouch!

Instead, we should ensure that functions called in RLS policies never accept a
row value as argument. We can do this by restructuring the logic:

```sql title="Much better - only a single function call"
create function current_user_organization_ids() returns setof int as $$
  select organization_id
  from memebrs
  where user_id = current_user_id();
$$ language sql stable security definer;

create policy select_members
  for select on members
  using (
    /* highlight-next-line */
    organization_id in (select current_user_organization_ids())
  );
```

Here, PostgreSQL can call the function once at the start and then can use a
simple index check to select the rows that are visible according to the RLS
policy. This can be **literally thousands of times faster** than the previous
example.

You might think that this is likely to be _less performant_ when you're
fetching individual rows, but as a general rule of thumb PostgreSQL can read
millions of rows per second (and even more if it just needs index values), so
determining the list of `organization_id`s a user is a member of is so trivial
you can almost ignore it.

## Recommended Reading

- PostgreSQL [`CREATE FUNCTION`][] documentation for actually creating
  functions.
- PostgreSQL [`CREATE TRIGGER`][] documentation.
- StackOverflow answer describing [computed columns in PostgreSQL][].

[`create function`]: http://www.postgresql.org/docs/current/static/sql-createfunction.html
[`create trigger`]: http://www.postgresql.org/docs/current/static/sql-createtrigger.html
[computed columns in postgresql]: http://stackoverflow.com/a/11166268/1568890

## Procedural Languages

Functions in PostgreSQL require you to use either SQL or a procedural language.
The most common procedural language in PostgreSQL is [PL/pgSQL][pl/pgsql].

SQL is probably the easiest to use language for functions as you are most
likely already familiar with it. Because it lacks the looping constructs, it
also encourages you to write your functions in a performant way. We advise that
if your function can be written in SQL, it probably should be.

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

## Named Arguments

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

For the sake of your schema and your coworkers, you should always use named
arguments.

## Solving naming conflicts

Sometimes the names you have chosen for your function parameters will conflict
with names of columns or other identifiers accessible within your function. You
can solve this in a number of ways.

### Use function name

You can use the function's name to disambiguate a function argument from a
column value:

```sql {2}
create function get_user(id int) returns users as $$
  select * from users where users.id = get_user.id;
$$ language sql stable;
```

(If you happen to give your function the same name as your table, then you can
give the table an alias in the function body query to help disambiguate.)

### Numeric arguments

An alternative approach is to use [numeric
arguments](https://www.postgresql.org/docs/current/xfunc-sql.html#XFUNC-SQL-FUNCTION-ARGUMENTS)
such as `$1` for the first argument, `$2` for the second, and so on, the
represent the argument values, and use the table name to disambiguate column
values:

```sql {2}
create function get_user(id int) returns users as $$
  select * from users where users.id = $1;
$$ language sql stable;
```

### Variable substitution

The two approaches above work well in general, but there are some cases where
it is not enough. For example when you have an upsert (`INSERT...ON CONFLICT`)
statement in a `plpgsql` language function, such as:

```sql
create function upsert_value(id int, value text) returns void as $$
begin
  insert into my_table (id, value)
    values(id, value)
    /* highlight-next-line */
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

```sql {2}
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

## VOLATILE (Mutation) Functions

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

In simpler terms `VOLATILE` basically means you are changing data or
state.

Anyone familiar with HTTP could compare a `VOLATILE` function to “unsafe” HTTP
methods like `POST`, `PUT`, `PATCH`, and `DELETE`.

Certain VOLATILE functions will be exposed by PostGraphile as
[custom mutations](./custom-mutations/).

## STABLE/IMMUTABLE (Query) Functions

If your function does not modify any data or state, you should declare it as
`STABLE`.

:::info

If your function depends only on its arguments and does not fetch
data from other sources, nor is it dependent on configuration variables, then
you can declare it as `IMMUTABLE` which is a stricter form of `STABLE`.

We advise that you don't use `IMMUTABLE` until you become expert - stick to `STABLE`.

:::

By marking your function as `STABLE` or `IMMUTABLE`, PostgreSQL knows that it
can apply a number of optimisations, including memoization to avoiding calling
it multiple times for the same inputs during the same statement. Memoization is
a possible choice PostgreSQL may make, it is not guaranteed.

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

## SETOF Functions - Connections

As well as scalars, compound types, and arrays of these, PostgreSQL functions
can also return sets. Sets emulate tables, and so it's natural for PostGraphile
to expose these to GraphQL using [connections](./connections/) (or, if your
behaviors are configured to prefer lists, as lists).

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

_The original (pre-2018?) version of this article was written by [Caleb
Meredith](https://twitter.com/calebmer); thanks Caleb! It has been heavily
edited and expanded since._
