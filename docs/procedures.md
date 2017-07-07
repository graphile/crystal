# Procedures
Procedures in PostgreSQL are very important to understand in order to make the most powerful PostGraphQL server you can. Procedures allow you to define business logic in the database in SQL or one of many other scripting languages. Often putting your business logic in the database will be more performant as PostgreSQL is already finely tuned to be highly performant and scale for data intensive uses.

There are a few ways procedures in PostGraphQL can be used. All of these will be covered in their own section.

1. As [mutations](#mutation-procedures).
2. As [queries](#query-procedures).
3. As [connections](#connection-procedures) (list of nodes, like `postNodes`).
4. As [computed columns](#computed-columns).

For an example of what procedures look like, see the [forum example SQL schema][].

[forum example SQL schema]: https://github.com/calebmer/postgraphql/blob/master/examples/forum/schema.sql

## Recommended Reading
- PostgreSQL [`CREATE FUNCTION`][] documentation for actually creating procedures.
- PostgreSQL [`CREATE TRIGGER`][] documentation.
- StackOverflow answer describing [computed columns in PostgreSQL][].

[`CREATE FUNCTION`]: http://www.postgresql.org/docs/current/static/sql-createfunction.html
[`CREATE TRIGGER`]: http://www.postgresql.org/docs/current/static/sql-createtrigger.html
[computed columns in PostgreSQL]: http://stackoverflow.com/a/11166268/1568890

## Scripting Languages
Procedures in PostgreSQL require you to use a scripting language. The two most common procedure languages for PostgreSQL are SQL and [PL/pgSQL][PL/pgSQL]. SQL is probably the easiest to use as you are most likely already familiar with it. PL/pgSQL is PostgreSQL’s custom scripting language which is fairly easy to find plenty of StackOverflow and other resources on with a few search engine queries. You’ll need to learn PL/pgSQL if you want to write any triggers, because SQL can’t be used for triggers. But again, don’t worry, you can definitely make awesome applications without knowing PL/pgSQL as well as other languages you are familiar with as long as you defer to the internet.

A simple procedure written with SQL looks like this:

```sql
create function add(a int, b int) returns int as $$
  select a + b;
$$ language sql immutable strict;
```

The samle procedure with PL/pgSQL would look like this:

```sql
create function add(a int, b int) returns int as $$
begin
  return a + b;
end;
$$ language plpgsql immutable strict;
```

If you don’t want to use PL/pgSQL or SQL, many popular scripting languages can be used *inside* PostgreSQL to write your procedures! You can see a few of these projects here:

- [JavaScript (plv8)][]
- [Ruby (plruby)][]

A procedure defined using JavaScript (for example) would look like:

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

[PL/pgSQL]: http://www.postgresql.org/docs/current/static/plpgsql.html
[JavaScript (plv8)]: https://github.com/plv8/plv8
[Ruby (plruby)]: https://github.com/knu/postgresql-plruby

## Named Arguments
PostgreSQL allows you to mix named and positional (unnamed) arguments for your procedures. However, GraphQL will *only* allow named arguments. So if you don’t name an argument, PostGraphQL will give it a name like `arg1`, `arg2`, `arg3`, and so on. An example of a function with unnamed arguments is as follows:

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

## Mutation Procedures
By default, a procedure is “volatile” and PostGraphQL will treat it as a mutation. So for example, a procedure defined as:

```sql
create function my_function(a int, b int) returns int as $$ … $$ language sql;
```

Is equivalent to a procedure defined as:

```sql
create function my_function(a int, b int) returns int as $$ … $$ language sql volatile;
```

From the PostgreSQL docs:

> `VOLATILE` indicates that the function value can change even within a single table scan, so no optimizations can be made…But note that any function that has side-effects must be classified volatile, even if its result is quite predictable, to prevent calls from being optimized away; an example is `setval()`.

In simpler terms `VOLATILE` basically means you are changing your data.

Anyone familiar with HTTP could compare a `VOLATILE` procedure to “unsafe” HTTP methods like `POST`, `PUT`, and `DELETE`.

All mutative procedures will be represented in the GraphQL type system by PostGraphQL in a way that is Relay compatible with a single input object. You would execute a procedure similar to this one like so:

```graphql
mutation {
  myFunction(input: { a: 1, b: 2 }) {
    output
  }
}
```

Always look at the documentation in GraphiQL to find all the parameters you may use!

## Query Procedures
Similar to how you use `VOLATILE` to specify a mutative procedure, a query procedure can be specified using `IMMUTABLE` or `STABLE` identifiers. For example:

```sql
create function my_function(a int, b int) returns int as $$ … $$ language sql stable;

-- or…

create function my_function(a int, b int) returns int as $$ … $$ language sql immutable;

-- or if you wanted to return a row from a table…

create function my_function(a int, b int) returns my_table as $$ … $$ language sql stable;
```

From the PostgreSQL docs:

> `IMMUTABLE` indicates that the function cannot modify the database and always returns the same result when given the same argument values; that is, it does not do database lookups or otherwise use information not directly present in its argument list. If this option is given, any call of the function with all-constant arguments can be immediately replaced with the function value.

and…

> `STABLE` indicates that the function cannot modify the database, and that within a single table scan it will consistently return the same result for the same argument values, but that its result could change across SQL statements. This is the appropriate selection for functions whose results depend on database lookups, parameter variables (such as the current time zone), etc. (It is inappropriate for AFTER triggers that wish to query rows modified by the current command).

To use the HTTP analogy again, `IMMUTABLE` and `STABLE` are comparable to “safe” HTTP methods like `GET` and `HEAD`.

To query such a procedure in PostGraphQL you would do the following:

```graphql
{
  # For a procedure without arguments
  myFunction

  # For a procedure with arguments
  myFunction(a: 1, b: 2)

  # For a procedure that returns a row
  myFunction(a: 1, b: 2) {
    id
  }
}
```

## Connection Procedures
A connection query can be made from any function that returns a `setof` with a table type. This feature is also significant in that it gives you the ability to create complex queries over a set of data. Queries that connections (like `personNodes`) in PostGraphQL do not support.

To create a function that returns a connection, use the following SQL:

```sql
-- Assuming we already have a table named `person`…

create function my_function(a int, b int) returns setof person as $$ … $$ language sql;
```

To query a set in PostGraphQL, you would use all of the connection arguments you are familiar with in addition to the arguments to your procedure. For example:

```graphql
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

For more information on constructing advanced queries, read [this article][advanced-queries].

[advanced-queries]: https://github.com/calebmer/postgraphql/blob/master/docs/advanced-queries.md

## Computed Columns
PostGraphQL also provides support for computed columns. In order to define a computed column, just write a function that is `STABLE` or `IMMUTABLE`, has a table in your schema as its first argument, and the name starts with the table’s name. For example:

```sql
create function person_full_name(person person) returns text as $$
  select person.given_name || ' ' || person.family_name
$$ language sql stable;
```

Will create a computed column for your table named `person`.

To query these in the PostGraphQL schema, its pretty intuitive:

```graphql
{
  person(id: …) {
    givenName
    familyName
    fullName # A computed column, but the client doesn’t even know!
    myFunction(a: 1, b: 2) # A computed column with arguments.
  }
}
```

* * *

For ideas on how to use procedures in PostGraphQL, remember to check out the [forum example SQL schema][]!

[forum example SQL schema]: https://github.com/calebmer/postgraphql/blob/master/examples/forum/schema.sql
