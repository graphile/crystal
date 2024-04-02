---
layout: page
path: /postgraphile/production/
title: Production Considerations
---

import Pro from "@site/src/components/Pro";
import Spon from "@site/src/components/Spon";

When it comes time to deploy your PostGraphile application to production,
there's a few things you'll want to think about including topics such as
logging, security and stability. This article outlines some of the issues you
might face, and how to solve them.

### Database Access Considerations

PostGraphile is just a node app / middleware, so you can deploy it to any number
of places: Heroku, Now.sh, a VM, a container such as Docker, or of course onto
bare metal. Typically you won't run PostGraphile on the same
hardware/container/VM as the database, so PostGraphile needs to be able to
connect to your database without you putting your DB at risk.

A standard way of doing this is to put the DB behind a firewall. However, if
you're using a system like Heroku or Now.sh you probably can't do that, so
instead you must make your DB accessible to the internet. When doing so here are
a few things we recommend:

1.  Only allow connections over SSL (`force_ssl` setting)
2.  Use a secure username (not `root`, `admin`, `postgres`, etc which are all
    fairly commonly used)
3.  Use a super secure password; you can use a command like this to generate
    one: `openssl rand -base64 30 | tr '+/' '-_'`
4.  Use a non-standard port for your PostgreSQL server if you can (pick a random
    port number)
5.  Use a hard-to-guess hostname, and never reveal the hostname to anyone who
    doesn't need to know it
6.  If possible, limit the IP addresses that can connect to your DB to be just
    those of your hosting provider.

Heroku have some instructions on making RDS available for use under Heroku which
should also work for Now.sh or any other service:
https://devcenter.heroku.com/articles/amazon-rds

It is recommended that you use the `--no-ignore-rbac` (or `ignoreRBAC: false` in
the library). It inspects the RBAC (GRANT / REVOKE) privileges in the database
and reflects these in your GraphQL schema. As is GraphQL best practices, this
still only results in one GraphQL schema (not one per user), so it takes the
user account you connect to PostgreSQL with (from your connection string) and
walks all the roles that this user can become within the database, and uses the
union of all these permissions. Using this flag is recommended, as it results in
a much leaner schema that doesn't contain functionality that you can't actually
use.

### Common Middleware Considerations

In a production app, you typically want to add a few common enhancements, e.g.

- Logging
- Gzip or similar compression
- Security protections
- Rate limiting

Since there's already a lot of options and opinions in this space, and they're
not directly related to the problem of serving GraphQL from your PostgreSQL
database, PostGraphile does not include these things by default. We recommend
that you use something like Express middlewares to implement these common
requirements. This is why we recommend
[using PostGraphile as a library](./usage-library/) for production usage.

Picking the Express (or similar) middlewares that work for you is beyond the
scope of this article; below is an example of where to place these middlewares.

```js
const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

/* Example middleware you might want to put in front of PostGraphile */
// app.use(require('morgan')(...));
// app.use(require('compression')({...}));
// app.use(require('helmet')({...}));

app.use(postgraphile(process.env.DATABASE_URL || "postgres:///"));

app.listen(process.env.PORT || 3000);
```

Should you want to use something like PostGraphile's built in logging, but send
it to your own logging provider, you can compose a PostGraphile server plugin to
do so. Here's an example plugin that uses Nuxt's consola library for logging,
you could use it as a base for your own plugin:
https://github.com/graphile/postgraphile-log-consola

### Denial of Service Considerations

When you run PostGraphile in production you'll want to ensure that people cannot
easily trigger denial of service (DOS) attacks against you. Due to the nature of
GraphQL it's easy to construct a small query that could be very expensive for
the server to run, for example:

```graphql
allUsers {
  nodes {
    postsByAuthorId {
      nodes {
        commentsByPostId {
          userByAuthorId {
            postsByAuthorId {
              nodes {
                commentsByPostId {
                  userByAuthorId {
                    postsByAuthorId {
                      nodes {
                        commentsByPostId {
                          userByAuthorId {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

There's lots of techniques for protecting your server from these kinds of
queries; a great introduction to this subject is
[this blog post](https://dev-blog.apollodata.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b)
from Apollo.

These techniques should be used in conjunction with common HTTP protection
methods such as rate limiting which are typically better implemented at a
separate layer; for example you could use
[Cloudflare rate limiting](https://www.cloudflare.com/rate-limiting/) for this,
or an Express.js middleware.

#### Statement Timeout

One simple solution to this issue is to place a timeout on the database
operations via the
[`statement_timeout` PostgreSQL setting](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STATEMENT-TIMEOUT).
This will halt any query that takes longer than the specified number of
milliseconds to execute. This can still enable nefarious actors to have your
database work hard for that duration, but it does prevent these malicious
queries from running for an extended period, reducing the ease of a DoS (Denial
of Service) attack. This solution is a good way to catch anything that may have
slipped through the cracks of your other defences, or just to get you up and
running while you work on more robust/lower level solutions, but when you expose
your GraphQL endpoint to the world it's better to cut things off at the source
before a query is ever sent to the database using one or more of the techniques
detailed below.

Currently you can set this on a per-transaction basis using the
[`pgSettings` functionality](./usage-library/#pgsettings-function) in
PostGraphile library mode, e.g.:

```js
app.use(
  postgraphile(process.env.DATABASE_URL, "public", {
    // ...
    pgSettings: {
      statement_timeout: "3000",
    },
  }),
);
```

You can also set this up on a per connection basis if you pass a correctly
configured `pg.Pool` instance to PostGraphile directly, e.g.:

```js
const { Pool } = require('pg');

const pool = new Pool();
pool.on('connect', (client) => {
  client.query('SET statement_timeout TO 3000')
});

// ...
app.use(postgraphile(pool, "public", { ... }));
// ...
```

#### Simple: Query Allowlist ("persisted queries" / "persisted operations")

If you do not intend to allow third parties to run arbitrary operations against
your API then using
[persisted operations](https://github.com/graphile/persisted-operations) as a
query allowlist is a highly recommended solution to protect your GraphQL
endpoint. This technique ensures that only the operations you use in your own
applications can be executed on the server, preventing malicious (or merely
curious) actors from executing operations which may be more expensive than those
you have written.

This technique is suitable for the vast majority of use cases and supports many
GraphQL clients, but it does have a few caveats:

- Your API will only accept operations that you've approved, so it's not
  suitable if you want third parties to run arbitrary custom operations.
- You must be able to generate a unique ID (e.g. a hash) from each operation at
  build time of your application/web page - your GraphQL operations must be
  "static". It's important to note this only applies to the operation document
  itself, the variables can of course change at runtime.
- You must have a way of sharing these static operations from the application
  build process to the server so that the server will know what operation the ID
  represents.
- You must be careful not to use variables in dangerous places within your
  operation; for example if you were to use `allUsers(first: $myVar)` a
  malicious attacker could set `$myVar` to 2147483647 to cause your server to
  process as much data as possible. Use fixed limits, conditions and orders
  where possible, even if it means having additional static operations.
- It does not protect you from writing expensive queries yourself; it may be
  wise to combine this technique with a cost estimation technique such as that
  provided by the [Graphile Pro plugin](/pricing/) to help guide your developers
  and avoid accidentally writing expensive queries.

PostGraphile has first-party support for persisted operations via the open
source
[@graphile/persisted-operations](https://github.com/graphile/persisted-operations)
plugin; we recommend its use to the vast majority of our users.

#### Advanced

Using a query allowlist puts the decision in the hands of your engineers whether
a particular query should be accepted or not. Sometimes this isn't enough - it
could be that your engineers need guidance to help them avoid common pit-falls
(e.g. forgetting to put limits on collections they query), or it could be that
you wish arbitrary third parties to be able to send queries to your API without
the queries being pre-approved and without the risk of bringing your servers to
their knees.

:::info

You are highly encouraged to purchase the [Pro Plugin](/pricing/) <Pro />, which
implements these protections in a deeply-integrated and PostGraphile-optimized
way. Sponsors <Spon /> also have access to the Pro Plugin and have the added benefit
of helping sustain development and maintenance on the project. You can read the
[@graphile/pro README on npm](https://www.npmjs.com/package/@graphile/pro).

:::

The following details how the Pro Plugin addresses these issues, including hints
on how you might go about solving the issues for yourself. Many of these
techniques can be implemented outside of PostGraphile, for example in an express
middleware or a nginx reverse proxy between PostGraphile and the client.

#### Sending queries to read replicas

Probably the most important thing regarding scalability is making sure that your
master database doesn't bow under the pressure of all the clients talking to it.
It's wise to perform load testing to figure out at what point this will occur,
and have a plan for it. One way to reduce this pressure is to offload read
operations to read replicas (clones of your primary database)

- this reduces the load on your primary database significantly, and reduces the
  need for complex caching layers. In GraphQL it's easy to tell if a request
  will perform any writes or not: if it's a `query` then it's read-only, if it's
  a `mutation` then it may perform writes.

Using `--read-only-connection <string>` <Pro />&nbsp;<Spon /> you may give PostGraphile a
separate connection string to use for queries, to compliment the connection
string passed via `--connection` which will now be used only for mutations.

(If you're using middleware, then you should use the `readOnlyConnection` option
instead.)

> NOTE: We don't currently support the multi-host syntax for this connection
> string, but you can use a PostgreSQL proxy such a PgPool or PgBouncer between
> PostGraphile and your database to enable connecting to multiple read replicas.

#### Pagination caps

It's unlikely that you want users to request `allUsers` and receive back
literally all of the users in the database. More likely you want users to use
cursor-based pagination over this connection with `first` / `after`. The Pro
Plugin introduces the `--default-pagination-cap [int]` <Pro />&nbsp;<Spon /> option (library
option: `defaultPaginationCap`) which enables you to enforce a pagination cap on
all connections. Whatever number you pass will be used as the pagination cap
(allowing requests smaller or equal to this cap to go through, and blocking
those above it), but you can override it on a table-by-table basis using
[smart comments](./smart-comments/) - in this case the `@paginationCap`<Pro />&nbsp;<Spon />
Smart Comment.

```sql
comment on table users is
  E'@paginationCap 20\nSomeone who can log in.';
```

#### Limiting GraphQL query depth

Most GraphQL queries tend to be only a few levels deep, queries like the deep
one at the top of this article are generally not required. You may use
`--graphql-depth-limit [int]` <Pro />&nbsp;<Spon /> to limit the depth of any GraphQL queries
that hit PostGraphile - any deeper than this will be discarded during query
validation.

#### [EXPERIMENTAL] GraphQL cost limit

The most powerful way of preventing DOS is to limit the cost of GraphQL queries
that may be executed against your GraphQL server. The Pro Plugin contains a
early implementation of this technique with heuristically estimated costs. You
may enable a cost limit with `--graphql-cost-limit [int]` <Pro />&nbsp;<Spon /> and the
calculated cost of any GraphQL queries will be made available on `meta` field in
the GraphQL payload.

If your GraphQL query is seen to be too expensive, here's some techniques to
bring the calculated cost down:

- If you've not specified a limit (`first`/`last`) on a connection, we assume it
  will return 1000 results. You should always specify a limit.
- Cost is based on number of expected results (without looking at the database!)
  so lowering your limits on connections will also lower the costs.
- Connections multiply the cost of their children by the number of results
  they're expected to return, so lower the limits on parent connections.
- Nested fields multiply costs; so pulling a connection inside a connection
  inside a connection is going to be expensive - to address this, try placing
  lower `first`/`last` values on the connections or avoiding fetching nested
  data until you need to display it (split into multiple requests / only request
  the data you need for the current view).
- Subscriptions are automatically seen as 10x as expensive as queries - try and
  minimise the amount of data your subscription requests.
- Procedure connections are treated as more expensive than table connections.
- `totalCount` on a table has a high cost
- `totalCount` on a procedure has a higher cost
- Using `pageInfo` adds significant cost to connections
- Computed columns are seen as fairly expensive - in future we may factor in
  PostgreSQL's `COST` parameter when figuring this out.

Keep in mind cost analysis is hard and the real cost of a query varies wildly
based on what your database has been dealing with recently, what indexes are
available, and many more factors. Our cost estimation is based on analysis of a
large test suite, but feel free to reach out with any bad costs/queries so we
can improve this feature.
