---
layout: page
path: /postgraphile/v4-new-features/
title: v4 Feature Guide
---

Though the entry point to v4 is almost identical to v3 (with a few additional
options!), the guts of PostGraphile have been re-written from the ground up -
about 80% of the codebase has been replaced with the new Graphile Engine system
which is plugin-based.

Despite this huge change, v4 is still broadly compatible with v3; you can read
more about migrating from v3 to v4 in our [migration guide](./v3-migration/).

**Headlines**:

- 🚀🚀🚀 Massively improved base performance: up to 55x faster, 90% reduced RAM,
  1/20th latency
- Cluster mode (`--cluster-workers 4`) for even greater performance still (uses
  more cores, RAM)
- Plugin system - no need to maintain a fork; mix and match additional
  functionality
- Tidier schema:
  - PostgreSQL extension resources automatically omitted (disable with
    `--include-extension-resources`)
  - with `--no-ignore-rbac`, automatically omit tables and columns the user
    account you connect to PostgreSQL with (from your connection string) doesn't
    have permission to access.
  - [smart comments](./smart-comments/) for omitting, renaming and deprecating
    things easily
  - [write your own naming functions](./inflection/) if you don't like the built
    in ones!
    - `userByAuthorId` becomes just `author` with the help of
      `@graphile-contrib/pg-simplify-inflector`
- One-to-one relationships detected correctly (connection interface still
  present but deprecated)
- Simple collections: option to avoid `edges` / `nodes` should you so desire
- GraphQL query batching
- `orderBy` more than one column
- GraphiQL improvements around watch mode
- Introspection cache (`--read-cache` / `--write-cache`)
- Better errors - with details on why it's occurred and often hints on how to
  fix!
- Support for PostgreSQL v10 identity columns
- Support for actually starting against PostgreSQL v11
- Support for `pg@7.x` npm module
- Support for `graphql@0.13.x`
- PostGraphileRC configuration file
- CLI `--no-server` option for writing out GraphQL schema and exiting
- Better support for common envvars
- TypeScript typings bundled
- Lots more hidden features
- Many many many many fixes
- Much better PostgreSQL feature support

---

### Performance: goodbye N+1 queries!

The performance of PostGraphile has massively increased over PostGraphQL v3; and
the memory usage has decreased too! If you run your database and PostGraphile on
different servers then you should find query times are improved even further by
the (significant!) reduction in the number of SQL queries that we generate.

I created an
[example database schema](https://github.com/graphile/postgraphile_changes/blob/master/db/reset.sh)
based on the forum example (but with some bells and whistles), filled it with
some data, and then benchmarked a
[number of queries](https://github.com/graphile/postgraphile_changes/tree/master/graphql)
against it (running everything locally on my machine (a 2011 iMac), using the
latest LTS release of Node.js for both v3 and v4).

The most extreme improvements came in the form of
[ThreadViewWithEmoji.graphql](https://github.com/graphile/postgraphile_changes/blob/master/graphql/ThreadViewWithEmoji.graphql).
This is a query that emulates loading the data to show a single thread page
within a complex forum - the thread itself (and its author), plus the first 20
posts within that thread, their authors, and the emoji responses that each of
the posts have received. It uses a computed column for the user `fullName`s, but
other than that it's just regular relations. Here's the results of v4 vs v3 for
this query:

- at concurrency = 1: 12x more requests/second, 90% reduction in RAM usage, and
  less than 1/10th the latency
- at concurrency = 10: 17x more requests/second, 92% reduction in RAM usage, and
  nearly 1/20th the latency
- at concurrency = 100: 55x more requests/second, 91% reduction in RAM usage,
  and around 1/40th the latency

Simpler queries still reveal good performance improvements. All in all,
PostGraphile v4 is capable of scaling much better than v3. There's still lots of
performance improvements to be made - we're not resting on our laurels!

### Plugins plugins plugins

PostGraphile's schema generation (and even the introspection itself!) are now
provided by a number of Graphile Engine plugins. Graphile Engine was invented
for PostGraphile (though it is also suitable for use in other GraphQL projects)
to enable easy extensibility of the core system. This means we can now have
community led feature development such as
[postgraphile-plugin-connection-filter](https://github.com/mattbretl/postgraphile-plugin-connection-filter)
(which adds a much more powerful filter engine to PostGraphile that the built in
`condition` argument) without having to have users maintain forks of the
project. These plugins can be maintained separately, and might be merged into
core at a later point.

It's also possible to turn off, or even replace, built in plugins - and of
course to add your own. So you can really customise PostGraphile now! See
[Schema Plugins](./extending/) for more information.

### Tidier schema

PostGraphile no longer includes resources from extensions automatically, so your
schema by default only includes the functionality you've added yourself. (Go
back to the old behaviour with `--include-extension-resources`.)

We highly recommend you enable the new `--no-ignore-rbac` option which tells
PostGraphile to omit anything from your GraphQL schema that you do not have
access to. This means that if you only do
`GRANT UPDATE (name, bio) ON users TO graphql_visitor;` then the update mutation
will only expose the `name` and `bio` fields. No more useless GraphQL fields
that throw errors when you attempt to use them! This option will probably be
enabled by default in v5.

### Omitting things

If there's something (a column, table, function, filter, relation) that you
don't want to express to GraphQL you can now remove it using our
[smart comments](./smart-comments/) feature. This feature is highly flexible, so
get in touch if you can think of more ways for it to help you build your perfect
schema!

### Deprecating tables/columns/functions

It's also possible to deprecate fields, tables, functions, etc by adding a
"smart comment"; e.g.

```sql
comment on column c.person.site is E'@deprecated Use `website` instead\nThe user''s homepage';
```

### Naming things

You no longer have to trust us to come up with the best names for your fields.
You can override individual fields using our [smart comments](./smart-comments/)
feature, or override the names that we auto-generate by using a plugin to
[override our inflectors](./inflection/) with your own.

These naming overrides can be shared like other plugins, for example I've
[written `@graphile-contrib/pg-simplify-inflector`](https://github.com/graphile-contrib/pg-simplify-inflector)
which changes fields like `userByAuthorId: User` into simply `author: User` - I
recommend you check it out.

### One-to-one relationships

If you have tables like this:

```sql
create table foo (
  id serial primary key
);

create table bar (
  foo_id int not null primary key references foo,
  name text
);
```

in V3 the one-to-one nature of the relationship was not accounted for, so you
would have to query like:

```graphql {5-7,9-11}
{
  fooById(id: 1) {
    # Due to this being one-to-one, at most one row would ever be returned,
    # however we didn't account for this and returned a connection anyway
    barsByFooId {
      edges {
        node {
          name
        }
      }
    }
  }
}
```

with v4's native support for these relations you can now use this much neater
query:

```graphql {3,5}
{
  fooById(id: 1) {
    barByFooId {
      name
    }
  }
}
```

No more unnecessary indirection!

Don't worry though, we still have the old relation too (to prevent this being a
breaking change), we've just deprecated it so it won't show up by default in
autocomplete/documentation/etc.

### Simple collections

PostGraphile has long supported Relay-compatible connections, but it now
supports simple list-based collections too. They're disabled by default, but you
can enable both interfaces with `--simple-collections both` or use the simpler
interface exclusively with `--simple-collections only`.

### GraphQL query batching

With the `--enable-query-batching` option for [the CLI](./usage-cli/); or
`enableQueryBatching: true` for the [library](./usage-library/) you can enable
our experimental Query Batching support.

Your GraphQL client will need query batching support to make use of this
(non-batched queries still work fine).

For Apollo, you can use the
[BatchHttpLink](https://www.apollographql.com/docs/link/links/batch-http.html)
link - something like:

```js
import { ApolloClient } from "apollo-client";
import { BatchHttpLink } from "apollo-link-batch-http";

const link = new BatchHttpLink({ uri: "/graphql" });

const client = new ApolloClient({
  link,
  // other options like cache
});
```

If you manually build the payload of your http request, you should provide an
array of queries to be executed as a batch. Example for a batch of 3 queries:

```json
[
  {
    "query": "...",
    "operationName": "...",
    "variables": {
      "someVariable": "..."
    }
  },
  {
    "query": "...",
    "operationName": "...",
    "variables": {
      "someVariable": "..."
    }
  },
  {
    "query": "...",
    "operationName": "...",
    "variables": {
      "someVariable": "..."
    }
  }
]
```

The response returned by PostGraphile is an array of the response of each query.
Example for a batch of 3 queries including one error:

```json
[
  {
    "data": [...]
  },
  {
    "data": [...]
  },
  {
    "errors": [...]
  }
]
```

### Order! Order!

Connections now support ordering by an array of columns rather than just one - a
much requested feature!

### Cache invalidation (Serverless)

People have been running PostGraphile on AWS Lambda and similar environments,
and one of the common issues that I hear is that boot up time is too slow. V4
addresses this in two ways:

1.  we offer the `--read-cache` and `--write-cache` options that allow plugins
    (including the introspection plugin!) to cache work that they do up front -
    note that we do _not_ handle invalidating this cache, so that remains your
    responsibility.
2.  by changing the minimum requirements of PostGraphile to Node.js 8.6 we can
    make use of native async/await support, resulting in much less code for Node
    to parse and execute.

### Better support, better errors

- Many previously invalid enums are now made valid
- When the introspection results in an empty name, an error is thrown explaining
  why
- When schema building results in a naming clash, an error it thrown explaining
  where the two names originated, and even hinting how to fix the issue
- When you specify `--schema` and that schema doesn't exist, you will be warned
- Tables that end in `_input` or `_patch` are renamed to FooInputRecord or
  similar to avoid clashes with mutation types on other tables
- Support `point`, `hstore` and `inet` types

### Column-level SELECT grants may now work

As part of the performance work, we now select only the fields we need (and we
also inline computed columns, in case you're interested!). As such, if you have
column-level SELECT grants you may find that this works with PostGraphile now.
Note, however, that this will not work with PostGraphile's default mutations,
nor with some computed columns. We do not recommend using column-level SELECT
grants - instead split your concerns into multiple tables and use the one-to-one
relationship feature to link them.

### pg@7.x and duck-typed pg

In v3 it was quite common to have conflicts with `pg` - where you had your own
version installed, and PostGraphile installed it's own version, and when you
passed a pgPool over to PostGraphile it would throw an error. Well no more! We
now look at the pgPool you've handed us and if it quacks like ~~a duck~~
`pg.Pool` then we'll trust you and treat it as a pg.Pool.

### Lots of hidden features

There's absolutely loads of things going on under the hood that we've not
officially exposed yet. You can use some of this goodness (e.g.
`pgColumnFilter`) by tapping into the `graphileBuildOptions` setting, but you'll
currently have to go digging to see what they are and how they work; and until
they're documented they're seen as experimental so there's no guarantees that
they won't be removed or modified.

- `handleErrors` for overriding how errors are output
- `X-GraphQL-Event-Stream` header support
- using variables in JSON subfields
- `prettier` for code formatting
