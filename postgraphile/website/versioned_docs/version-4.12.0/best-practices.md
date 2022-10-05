---
layout: page
path: /postgraphile/best-practices/
title: PostGraphile best practices
---

This guide is a work in progress. If you have ideas for best practices, please
use the "Suggest improvements to this page" link above to submit them, or
discuss them in #documentation on
[the PostGraphile Discord chat](http://discord.gg/graphile).

### Foreign Key Indexes

PostgreSQL does _NOT_ add indexes to foreign keys by default. This isn't an
issue for the forward relation (`user_id` → user), but for the reverse relation
(user → things by `user_id`) it can make the lookup very expensive. Always add
indexes to your foreign keys.

### Row Level Security

If you're using RLS, it's best to enable it on every table in your database. You
should at least enable it on every table in your exposed schemas.

### Use Table GRANT for SELECT/DELETE and Column GRANT for INSERT/UPDATE

The following are fine:

```sql
-- ✅ Fine
GRANT SELECT ON users TO graphql_role;
-- ✅ Fine
GRANT INSERT (column_1, column_2, ...) ON users TO graphql_role;
-- ✅ Fine
GRANT UPDATE (column_a, column_b, ...) ON users TO graphql_role;
-- ✅ Fine
GRANT DELETE ON users TO graphql_role;
```

The following should be avoided:

```sql
-- 🛑 DO NOT USE
GRANT SELECT (column_a, column_b) ON users TO graphql_role;
-- 🛑 DO NOT USE
GRANT INSERT ON users TO graphql_role;
-- 🛑 DO NOT USE
GRANT UPDATE ON users TO graphql_role;
```

Column-level SELECT grants
[cause a lot of issues](./requirements/#dont-use-column-based-select-grants):

- Reduces the number of optimisations we can do
- Cannot `SELECT * FROM`
- Cannot use `RETURNING *` (e.g. what we do in CRUD operations currently)
- Cannot pass a row type into a function (like we do for computed columns)

Table-level INSERT/UPDATE grants are not advisable because they lack the
explicitness that should come from such operations.

### Simplify Your GraphQL Field Names

You can get a leg up on this
[using `@graphile-contrib/pg-simplify-inflector`](https://github.com/graphile-contrib/pg-simplify-inflector).
The long names PostGraphile uses by default are to try and avoid people getting
naming conflicts when they run PostGraphile for the first time. Once you're more
comfortable you should move to using shorter names as it's a GraphQL best
practice.

### Enable the PostGraphile Recommended Options

(Scan the docs for `[RECOMMENDED]`, but take a moment to understand why they're
recommended and yet not enabled by default - they often require greater
knowledge of PostGraphile and your database.)

### Protect Your API

See [Production Considerations](./production/).

### Use `LANGUAGE sql` Over `LANGUAGE plpgsql` Where Possible

Performance reasons. Specifically, under many circumstances, functions in `SQL`
(but not `plpgsql`) can be inlined into the call-site and are thereby
transparent to the query planner. The PostgreSQL docs
[have a lot more details](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions).

### Name Triggers With A Numeric Prefix

e.g. `_200_do_a_thing` / `_800_do_something_else`

Reason: triggers in PostgreSQL run in lexicographical order.
