---
title: Best Practices
---

# PostGraphile Best Practices

This guide is a work in progress. If you have ideas for best practices, please
use the “Suggest improvements to this page” link to submit them, or
discuss them in #documentation on
[the Graphile Discord chat](http://discord.gg/graphile).

### Foreign Key Indexes

PostgreSQL does _NOT_ add indexes to foreign keys by default. This isn’t an
issue for the forward relation (getting the record that your record belongs
to), but for the reverse relation (getting all the records that belong to your
record) it can make the lookup very expensive. Always add indexes to your
foreign keys.

```sql
create table users (id serial primary key);
create table things (id serial primary key, user_id int not null references users);
/* highlight-next-line */
create index on things (user_id);
```

Out of the box, if you don’t do this then the “reverse relation” will not
appear in your GraphQL schema. You can force it to appear by giving the
foreign key constraint the `+select` behavior, or you can disable this behavior
by adding `disablePlugins: ['PgIndexBehaviorsPlugin']` to your configuration.

### Row Level Security

If you’re using RLS, it’s best to enable it on every table in your database.
You should at least enable it on every table in your exposed schemas. It’s
better to enable RLS and create a policy with `using (true)` to say “anything
goes” than to not enable RLS; this helps your team mates understand intent:
when you enable RLS you’re being explicit about what access is allowed, whereas
if you don’t you’re just implicitly allowing all access, which could have been
an oversight.

### Use Table GRANT for SELECT/DELETE and Column GRANT for INSERT/UPDATE

The following are fine:

```sql
-- ✅ Fine
grant select on users to graphql_role;
-- ✅ Fine
grant insert (column_1, column_2, ...) on users to graphql_role;
-- ✅ Fine
grant update (column_a, column_b, ...) on users to graphql_role;
-- ✅ Fine
grant delete on users to graphql_role;
```

The following should be avoided:

```sql
-- 🛑 DO NOT USE
grant select (column_a, column_b) on users to graphql_role;
-- 🛑 DO NOT USE
grant insert on users to graphql_role;
-- 🛑 DO NOT USE
grant update on users to graphql_role;
```

Column-level SELECT grants
[cause a lot of issues](./requirements#your-postgresql-database)
not just for PostGraphile:

- Cannot `select * from`
- Cannot use `returning *` on mutations
- Cannot pass a row type into a function (like we do for computed columns)

Table-level INSERT/UPDATE grants are not advisable because they lack the
explicitness that should come from such operations.

### Simplify Your GraphQL Field Names

You can get a leg up on this
[using `@graphile/simplify-inflection`](https://npmjs.com/package/@graphile/simplify-inflection).
The long names PostGraphile uses by default are to try and avoid people getting
naming conflicts when they run PostGraphile for the first time. Once you’re more
comfortable you should move to using shorter names as it’s a GraphQL best
practice.

### Protect Your API

See [Production Considerations](./production).

### Use `language sql` Over `language plpgsql` Where Possible

Performance reasons. Specifically, under many circumstances, functions in `SQL`
(but not `plpgsql`) can be inlined into the call-site and are thereby
transparent to the query planner. The PostgreSQL docs
[have a lot more details](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions).

### Name Triggers With A Numeric Prefix

e.g. `_200_do_a_thing` / `_800_do_something_else`

Reason: triggers in PostgreSQL run in lexicographical order.
