---
title: Custom Queries
---

You can add root-level `Query` fields to your GraphQL schema using "Custom
Queries". These are PostgreSQL functions, similar to
[computed columns](./computed-columns), that can return scalars, records, lists
or sets. Sets (denoted by `RETURNS SETOF ...`) are exposed as
[connections](./connections) or lists (depending on your behavior configuration). The arguments to these functions will be exposed
via GraphQL - named arguments are preferred, if your arguments are not named we
will assign them an auto-generated name such as `arg1`.

To create a function that PostGraphile will recognize as a custom query, it must
obey the following rules:

- adhere to
  [common PostGraphile function restrictions](./function-restrictions)
- if the function accepts arguments, the first argument must NOT be a table type
  (see [computed columns](./computed-columns))
- must NOT return `VOID`
- must be marked as `STABLE` (or `IMMUTABLE`, though that tends to be less
  common)
- must be defined in one of the introspected schemas

For example the functions:

```sql
CREATE FUNCTION my_function(a int, b int) RETURNS int AS $$ … $$ LANGUAGE sql IMMUTABLE;
CREATE FUNCTION my_other_function(a int, b int) RETURNS my_table AS $$ … $$ LANGUAGE sql STABLE;
```

could be queried in GraphQL like this:

```graphql
{
  # For a function without arguments
  myFunction

  # For a function with arguments
  myFunction(a: 1, b: 2)

  # For a function that returns a row
  myOtherFunction(a: 1, b: 2) {
    id
  }
}
```

### Example

Here we write a search query for our [forum example][] using the PostgreSQL
[`LIKE`][] operator variant, `ILIKE`, which is case insensitive. The custom
query we create is included in the forum example’s schema, so if you want to run
that example locally you can try it out.

```sql {10-27}
-- Columns unnecessary to this demo were omitted. You can find the full table in
-- our forum example.
create table post (
  …
  headline         text not null,
  body             text,
  …
);

-- Create the function named `search_posts` with a text argument named `search`.
-- This will expose `Query.searchPosts(search: String!, ...)` to GraphQL.
create function search_posts(search text)
  -- This function will return a set of posts from the `post` table. The
  -- `setof` part is important to PostGraphile, check out our Functions article
  -- to learn why.
  returns setof post as $$
    -- Write our advanced query as a SQL query!
    select *
    from post
    where
      -- Use the `ILIKE` operator on both the `headline` and `body` columns. If
      -- either return true, return the post.
      headline ilike ('%' || search || '%') or
      body ilike ('%' || search || '%')
  -- End the function declaring the language we used as SQL and add the
  -- `STABLE` marker so PostGraphile knows its a query and not a mutation.
  $$ language sql stable;
```

And that’s it! You can now use this function in your GraphQL like so:

```graphql {2}
{
  searchPosts(search: "Hello world", first: 5) {
    pageInfo {
      hasNextPage
    }
    totalCount
    nodes {
      headline
      body
    }
  }
}
```

:::tip Performance Note

This function will have poor performance because `ILIKE`
specifications of this form (beginning and ending with `%`) do not utilize
indexes. If you're doing this in a real application then it's highly recommended
that you look into
[PostgreSQL's Full Text Search](http://rachbelaid.com/postgres-full-text-search-is-good-enough/)
capabilities which can be exposed by a similar function. You may want to
[check out `websearch_to_tsquery` in PG11](https://www.postgresql.org/docs/11/static/functions-textsearch.html)
as part of this.

:::

### Extending schema in JS

If you prefer adding to your schema on the JavaScript side, you can use
[`makeExtendSchemaPlugin`](./make-extend-schema-plugin).

<!--
### GraphQL Schema Stitching

You can also stitch multiple GraphQL schemas together, you can read more about
doing this with PostGraphile here: [Authenticated and Stitched Schemas with
PostGraphile, Passport and
Stripe](https://medium.com/@sastraxi/authenticated-and-stitched-schemas-with-postgraphile-passport-and-stripe-a51490a858a2).

-->

[procedures]: /postgraphile/procedures/
[forum example]: https://github.com/graphile/postgraphile/tree/v4/examples/forum
[`like`]: http://www.postgresql.org/docs/current/static/functions-matching.html

### Advice

Though it may be tempting to expose huge collections via a function, it's
important to be aware that, when paginating across a function, only
`LIMIT/OFFSET` pagination can be used. (For convenience and consistency we
expose cursor pagination over functions, but internally this is just mapped to
`LIMIT`/`OFFSET` pagination.) Because of this, and because functions are seen as
a "black box" by PostgreSQL, if you try and paginate to, say, the 100,000th
record then PostgreSQL will literally have to execute the function until all
100,000 records have been generated, and this is often expensive.

One way to solve this is to have your function apply its own internal limits and
filters which can be exposed as GraphQL field arguments - if you reduce the
amount of data that the function can produce (e.g. to 100 rows) then it reduces
the potential cost of having this function in your schema.

:::caution Disclaimer

The information in this advice section is not 100% true, for
example PostgreSQL can "see through" some `SQL` functions and has a highly
intelligent query planner. If you're an expert on PostgreSQL then you should
ignore this advice and go with your own understanding, it's only intended to
help beginners from shooting themselves in the foot performance-wise.

:::
