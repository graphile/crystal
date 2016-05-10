# Advanced Queries
PostGraphQL, by default only allows you to query the entirety of rows in a table with fields like `personNodes` or `postNodes`. This may change in the future when PostGraphQL collaborators find a good way to represent complex queries across multiple columns with multiple operators in the GraphQL type system. Advanced queries allow you to write a query for your app in SQL, not the client, while still using the powerful GraphQL interface.

In the mean time there is another (arguably better) way to specify your own advanced queries with custom logic. By using [procedures][]!

So let’s write a search query for our [forum example][] using the PostgreSQL [`LIKE`][] operator (we’ll actually use `ILIKE` because it is case insensitive). The custom query we create is included in the forum example’s schema, so if you want to run that example locally you can try it out.

The procedure would look like the following. Indentation is non-standard so we can fit in comments to explain what’s going on.

```sql
-- Our `post` table is created with the following columns. Columns unnecessary
-- to this demo were omitted. You can find the full table in our forum example.
create table post (
  …
  headline         text not null,
  body             text,
  …
);

-- Create the function named `search_posts` with a text argument named `search`.
create function search_posts(search text)
  -- This function will return a set of posts from the `post` table. The
  -- `setof` part is important to PostGraphQL, check out our procedure docs to
  -- learn why.
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
  -- `STABLE` marker so PostGraphQL knows its a query and not a mutation.
  $$ language sql stable;
```

And that’s it! You can now use this function in your GraphQL like so:

```graphql
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

[procedures]: https://github.com/calebmer/postgraphql/blob/master/docs/procedures.md
[forum example]: https://github.com/calebmer/postgraphql/tree/master/examples/forum
[`LIKE`]: http://www.postgresql.org/docs/current/static/functions-matching.html
