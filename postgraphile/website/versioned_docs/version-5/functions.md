---
title: Database Functions
toc_max_heading_level: 4
---

One of the easiest ways to add more capabilities to your PostGraphile schema is
with PostgreSQL functions. The three main methods are:

- [Computed Columns](./computed-columns) enable you to add a computed field to
  a table type
- [Custom Queries](./custom-queries) enable you to add a root level Query field
  which can return a scalar, list, custom type, table row or even a table
  connection
- [Custom Mutations](./custom-mutations) enable you to add a root level
  Mutation field which can cause modifications to your database and return
  nothing (`void`), a scalar, list, custom type, table row or list of table rows
  (but not a connection, since you cannot paginate over a mutation)

If you want to leverage database functionality rather than PostGraphile plugins
to enhance your API then it’s very important to understand PostgreSQL
functions. Functions allow you to define business logic in the database using
SQL or one of many other scripting languages.

For some function examples, you can refer to the [forum example SQL schema][].

[forum example sql schema]: https://github.com/graphile/postgraphile/blob/v4/examples/forum/schema.sql

## Understanding function performance

Well written business logic in the database will often be significantly more
performant then writing the business logic in the application layer. This is
because PostgreSQL is finely tuned for data intensive uses (with statistics and
indexes to guide it) and because the round-trip time is minimized. However, it's
very easy to write poorly performing code in any environment if you're not
familiar with how that environment will execute your logic, and the database is
no exception to this.

:::info[Take care to adapt your coding pattern to the new paradigm-shift]

It’s _very easy_ to have very poor performance in the database if
you try and move your procedural programming language knowledge over without
making accommodations for the new paradigm you’re in. In PostgreSQL, every
function call and every statement executed has a performance overhead, so if
you don’t adapt your coding patterns to be optimal for a database, you will
likely get poor performance. This poor performance from poorly written database
functions is one of the reasons some critics claim that business logic in the
database should not be used.

:::

### Avoid looping

Procedural language programmers (people who write JS/TS, C, Java, Ruby, Python,
PHP, ...) will likely be tempted to use the `FOR`, `FOREACH` and `LOOP`
constructs to manipulate rows, since that’s what they would do in their
procedural code. But doing so might result in PostgreSQL having to perform
hundreds, thousands, or even millions of individual SQL queries and function
calls under the hood of your function.

In PostgreSQL you should **almost never** use these looping constructs, instead
you should perform **set operations** where possible.

#### Example: archiving forums

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

### Function inlining (or lack thereof!)

From the PostgreSQL planner point of view, _most_ functions (see exceptions
below) are a "black box" in terms of optimization: Postgres is forced to call
each function for each set of parameters and execute them separately from the
parent query &mdash; it can't turn the function body into a subquery or rewrite
it as a join, it can't push "order by" or "where" clauses down into the function
body, etc. If you were to apply an "order by" to such a "black box" function,
Postgres must first compute the entire results of the function, store them into
temporary storage (which may or may not result in writing them to disk) and then
apply ordering to this result set.

When functions are written by developers unfamiliar with how PostgreSQL function
execution works, this can result in incredibly poor performance, and often leads
to the mantra of "don't put business logic in the database" &mdash; but this
mantra is misguided. If you embrace the declarative nature of the database you
can typically create business logic that is much more performant than the
equivalent in the application layer, and enables you to reach a much larger
scale before you have to worry about managing your own caches (and cache
invalidation!) manually.

Not all functions are a "black box" from a PostgreSQL optimization point of view
&mdash; if you're careful with how you write a function, you can make it
"inlineable" such that PostgreSQL will insert the body of the function into the
query and forget that it even came from a function in the first place. To see a
rough set of rules that must hold for your function to be inlined, please see
[Inlining of SQL
functions](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions) in the
PostgreSQL wiki; but the most important part is it must be `LANGUAGE sql`;
functions written in other languages, including `plpgsql`, can never be inlined.

:::tip[Move expensive "presentational" functions to plugins]

Functions in the database can be generally split into two categories: business
logic (typically security-critical functionality e.g. RLS policies, custom
mutations, etc) and presentational (e.g. exposing interfaces for search,
summarizing data, and other concerns that aren't security-critical).

Presentational logic that is expensive to build in the database can typically
be moved to an [`extendSchema()`](./extend-schema.md) plugin (or similar)
in order to massively improve performance. Plugins inject SQL directly into the
query, and since the SQL is explicitly in the query issued to the database,
PostgreSQL can do its normal query rewriting and plan optimization against it.
As such, from the PostgreSQL's planner perspective, SQL added by plugins is an
open book, ripe for optimization.

When you're hitting performance issues with SQL functions, and in particular
with "computed column" SQL functions, your best bet is typically to move them
from database functions into schema plugins &mdash; see the example below.

:::

#### Example: row-level security function

**DO NOT PASS ROW DATA TO RLS FUNCTIONS!**

A common mistake that we see people make is passing data from rows as input to
functions called in RLS policies. For example:

```sql title="BAD! Uses row data in function call"
create function current_user_is_member_of(target_organization_id int) returns boolean as $$
  select exists(
    select 1
    from members
    where organization_id = target_organization_id
    and user_id = current_user_id()
  );
$$ language sql stable security definer;

create policy select_members
  for select on members
  using (
    -- DO NOT DO THIS!!
    /* highlight-next-line */
    current_user_is_member_of(members.organization_id)
  );
```

This function is `security definer` so it cannot be inlined; thus each new value
for `members.organization_id` requires the `current_user_is_member_of` function
to be executed independently, meaning that (depending on the other filters used
in the query) we may be calling the `current_user_is_member_of` function for
every unique `organization_id` in the database. And that’s the best case, at
worst PostgreSQL may invoke the overhead of the function call for every row.
Ouch!

Instead, we should ensure that functions called in RLS policies never accept a
row value as argument. We can do this by restructuring the logic:

```sql title="Much better - only a single function call"
create function current_user_organization_ids() returns setof int as $$
  select organization_id
  from members
  where user_id = current_user_id();
$$ language sql stable security definer;

create policy select_members
  for select on members
  using (
    /* highlight-next-line */
    organization_id in (select current_user_organization_ids())
  );
```

Since the function accepts no arguments (or only constant arguments), PostgreSQL
can call the function once at the start and reuse the result without
recomputing. When applying the RLS policy, the `organization_id` restriction can
be accomplished with excellent performance using a database index. This can be
**literally thousands of times faster** than the previous example.

You might think that this is likely to be _less performant_ when you’re
fetching individual rows, but as a general rule of thumb PostgreSQL can read
millions of rows per second (and even more if it just needs index values), so
determining the list of `organization_id`s a user is a member of is so trivial
you can almost ignore it.

#### Example: computed column function

If your [SQL function can be
inlined](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions) as
discussed above, it's typically fine to use it as a [computed column
function](./computed-columns.md).

However, for functions that cannot be inlined, the "computed column function"
pattern can result in very poor performance. If you notice such a function is
problematic in your queries, you can move it into the application layer such
that the SQL is injected directly into the query, allowing PostgreSQL to
optimize it. This is particularly useful if you need to dynamically construct
the SQL to be executed. This can be done without a breaking change to the
GraphQL schema.

Here's a very simple example:

```sql title="BAD! Cannot be inlined!"
create function users_filtered_things(u users, include_archived boolean)
returns setof things as $$
declare
  sql text;
begin
  -- Dynamically construct our SQL
  sql := format(
    'select t.* from things t where t.user_id = $1%s',
    case when include_archived then '' else ' and archived_at is null' end
  );

  -- Execute the SQL
  return query execute sql using u.id;
end;
$$ language plpgsql stable;
comment on function users_filtered_things is E'@behavior +filter';
```

PostgreSQL can't inline the above (since it uses `plpgsql`) so it can end up
very expensive.

However, we can do the same work in an `extendSchema()` plugin, and the
resulting SQL will be fully inlined and optimized with identical GraphQL schema
produced:

```ts title="Plugins inline even dynamically generated SQL"
export const MyPlugin = extendSchema((build) => {
  const {
    grafast: { lambda },
    pgResources: { things },
  } = build;
  return {
    typeDefs: /* GraphQL */ `
      extend type User {
        filteredThings(includeArchived: Boolean): ThingsConnection!
      }
    `,
    objects: {
      User: {
        plans: {
          filteredThings($user, { $includeArchived }) {
            // Create a pgSelect step representing all things owned by this user:
            const $things = things.find({ user_id: $user.get("id") });

            // Apply dynamic changes to the query based on runtime values:
            $things.apply(
              lambda(
                $includeArchived /* ← plan-time step */,
                (includeArchived /* ← runtime value */) =>
                  // At runtime, this callback will be called to manipulate the
                  // SQL query before it is executed
                  (queryBuilder) => {
                    if (!includeArchived) {
                      queryBuilder.where((sql) => sql`archived_at is null`);
                    }
                  },
              ),
            );

            // Wrap this collection in a connection
            return connection($things);
          },
        },
      },
    },
  };
});
```

:::note[PostGraphile will add the connection arguments automatically]

Since this example adds a field returning `ThingsConnection`, PostGraphile
will automatically add the `first`/`last`/`before`/`after`/etc arguments.
You can disable this through use of scope:

```ts
        plans: {
          filteredThings: {
            scope: {
              // Disable the connection-related arguments being auto-added
              isPgFieldConnection: false,
            },
            plan($user, { $includeArchived }) {
              // ...
```

:::

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

PL/pgSQL is PostgreSQL’s custom procedural language, it’s fairly easy to pick up
and there are plenty of StackOverflow and other resources for this language.
You’ll need to learn PL/pgSQL (or one of the other procedural languages) if you
want to write any triggers, because SQL can’t be used for triggers. Don’t
worry — you can definitely make awesome applications without a deep knowledge of
PL/pgSQL.

A simple function written with `LANGUAGE sql` looks like this:

```sql
create function add(a int, b int) returns int as $$
  select a + b;
$$ language sql immutable strict;
```

The same function with `LANGUAGE plpgsql` could look like this:

```sql
create function add(a int, b int) returns int as $$
begin
  return a + b;
end;
$$ language plpgsql immutable strict;
```

If you don’t want to use PL/pgSQL or SQL, many popular scripting languages can
be used _inside_ PostgreSQL to write your functions! You can see a few of these
projects here:

- [JavaScript (plv8)][]
- [Ruby (plruby)][]

For example, a function defined using JavaScript could look like:

```sql
-- This does look the exact same as the PL/pgSQL example…
create function add(a int, b int) returns int as $$
  return a + b;
$$ language plv8 immutable strict;

-- Here’s a better example from the plv8 repo…
create function plv8_test(keys text[], vals text[]) returns text as $$
  var object = {}
  for (var i = 0; i < keys.length; i++) {
    object[keys[i]] = vals[i]
  }
  return JSON.stringify(object)
$$ language plv8 immutable strict;
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
create function add(int, int) returns int as $$
  select $1 + $2;
$$ language sql immutable strict;
```

Whereas named arguments look like:

```sql
create function add(a int, b int) returns int as $$
  select a + b;
$$ language sql immutable strict;
```

For the sake of your schema and your coworkers, you should always use named
arguments.

## Solving naming conflicts

Sometimes the names you have chosen for your function parameters will conflict
with names of columns or other identifiers accessible within your function. You
can solve this in a number of ways.

### Use function name

You can use the function’s name to disambiguate a function argument from a
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
create function my_function(a int, b int) returns int as $$
  …
$$ language sql;
```

is equivalent to a function defined as:

```sql
create function my_function(a int, b int) returns int as $$
  …
$$ language sql volatile;
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
[custom mutations](./custom-mutations).

## STABLE/IMMUTABLE (Query) Functions

If your function does not modify any data or state, you should declare it as
`STABLE`.

:::info[When to use `IMMUTABLE`]

If your function depends only on its arguments and does not fetch
data from other sources, nor is it dependent on configuration variables, then
you can declare it as `IMMUTABLE` which is a stricter form of `STABLE`.

We advise that you don’t use `IMMUTABLE` until you become expert — stick to `STABLE`.

:::

By marking your function as `STABLE` or `IMMUTABLE`, PostgreSQL knows that it
can apply a number of optimizations, including memoization to avoiding calling
it multiple times for the same inputs during the same statement. Memoization is
a possible choice PostgreSQL may make, it is not guaranteed.

Here’s examples of defining functions as STABLE/IMMUTABLE:

```sql
create function my_function(a int, b int) returns int as $$
  …
$$ language sql stable;

-- or…

create function my_function(a int, b int) returns int as $$
  …
$$ language sql immutable;

-- or if you wanted to return a row from a table…

create function my_function(a int, b int) returns my_table as $$
  …
$$ language sql stable;
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
[custom queries](./custom-queries) or [computed columns](./computed-columns).

## SETOF Functions — Connections

As well as scalars, compound types, and arrays of these, PostgreSQL functions
can also return sets. Sets emulate tables, and so it’s natural for PostGraphile
to expose these to GraphQL using [connections](./connections) (or, if your
behaviors are configured to prefer lists, as lists).

SETOF functions can be a powerful way of exposing data to the user that may be
too much for them to handle all at once and require pagination.

To create a function that returns a connection, you could use SQL such as this:

```sql
-- Assuming we already have a table named `person`…
create function my_function(a int, b int) returns setof person as $$
  …
$$ language sql stable;
```

This function would be recognized as a [custom query](./custom-queries), and
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
[here](./custom-queries).

[forum example sql schema]: https://github.com/graphile/postgraphile/blob/v4/examples/forum/schema.sql

---

_The original (pre-2018?) version of this article was written by [Caleb
Meredith](https://twitter.com/calebmer); thanks Caleb! It has been heavily
edited and expanded since._
