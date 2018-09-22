<img width="120" height="120" title="PostGraphile logo" src="https://cdn.rawgit.com/graphile/graphile.github.io/a6225f8c3052df5c276ecef28aeb0cade1aec16a/logos/postgraphile.optimized.svg" />

# PostGraphile

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support PostGraphile development on Patreon"><img src="https://img.shields.io/badge/donate-via%20Patreon-orange.svg" alt="Patreon donate button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/package/postgraphile)
![MIT license](https://img.shields.io/npm/l/postgraphile.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

_**An instant, highly-performant GraphQL API for your PostgreSQL database, extensible via a powerful plugin system.**_

**Documentation: [graphile.org/postgraphile](https://graphile.org/postgraphile)**

_Note: v1-v3 of this project were named **PostGraphQL**. A v3-v4 migration guide is
available [here](https://www.graphile.org/postgraphile/v3-migration/) and you can check
out some of the new features
[here](https://www.graphile.org/postgraphile/v4-new-features/). No more
development is taking place on v3, but you can still access its branch
[here](https://github.com/graphile/postgraphile/tree/v3)._

---

**GraphQL** is a powerful new way to query your servers - it's typically used as a replacement for, or companion to, RESTful API services. Introduced by Facebook in 2015, it features strong data typing, built in introspection and documentation capabilities, and solves among many other things the problems of over- and under-fetching data. It's particularly great for mobile clients where minimizing number of requests, latency, and payload size are all critically important tasks - but this awesome mobile experience makes regular webpages much smoother too.

**PostgreSQL** is the self-proclaimed “world’s most advanced open source database,” and despite its over 20 year maturity this still rings true. New versions of PostgreSQL are released regularly, and each new major version brings incredible new features, not to mention massive performance gains. Seeing your database as just a plain CRUD store is now an archaic viewpoint, modern PostgreSQL can do so much for you: from enforcing business logic with Role-Based Access Control (RBAC) and Row-Level Security (RLS), through communicating with other systems via Foreign Data Wrappers, to real time notifications with `LISTEN`/`NOTIFY`, PostgreSQL can handle it all with ease.

**PostGraphile** pairs these two incredible technologies together to help you not only build applications more rapidly, but to build faster applications! Access the power of PostgreSQL through a well designed, extensible, customisable and incredibly performant GraphQL server. PostGraphile uses PostgreSQL reflection APIs to automatically detect tables, columns, indexes, relationships, views, types, functions, comments, and more - providing a GraphQL server that is highly intelligent about your data. PostGraphile can automatically detect changes to your database (e.g. new columns or tables) and instantly rebuild and serve the updated GraphQL API - even updating GraphiQL automatically! This leads to incredible productivity gains, and helps developers multiply their impact.

With PostGraphile, a well designed database schema should be all you need to serve a well thought out API; and if it isn't - well, we have a powerful plugin system including many [community contributed plugins](https://www.graphile.org/postgraphile/community-plugins/)! PostgreSQL already has amazing authorization and relationship infrastructure, _why duplicate that logic_ in a custom API? A PostGraphile API is likely to provide a more performant and standards compliant GraphQL API then any created in-house, and can be built in a fraction of the time. Focus on your product and let PostGraphile worry about the API layer.

For a critical evaluation of PostGraphile to determine if it fits in your tech stack, read [evaluating PostGraphile for your project](https://www.graphile.org/postgraphile/evaluating/).

## Introduction

Watch a talk by the original author [Caleb](https://twitter.com/calebmer) at GraphQL Summit for a walk-through of building an application with PostGraphile in under 7 minutes. This was using v2 (then called PostGraphQL); we're now up to v4 which has many more bells and whistles!

[![PostGraphile at GraphQL Summit](https://img.youtube.com/vi/b3pwlCDy6vY/0.jpg)](https://www.youtube.com/watch?v=b3pwlCDy6vY)

## Usage

**Documentation: [graphile.org/postgraphile](https://graphile.org/postgraphile)**

You can use PostGraphile via the CLI, as a middleware, or just use the GraphQL schema directly. Make sure to check out the **[forum example][]** and especially **[step by step tutorial][]** for a demo of a PostGraphile compliant schema and authentication.

[forum example]: https://github.com/graphile/postgraphile/tree/master/examples/forum
[step by step tutorial]: https://github.com/graphile/postgraphile/blob/master/examples/forum/TUTORIAL.md

### CLI

Install using npm:

```bash
npm install -g postgraphile
```

…and then just run it! By default, PostGraphile will connect to your local database at `postgres://localhost:5432` and introspect the `public` schema. See [the available CLI flags](https://www.graphile.org/postgraphile/usage-cli/) with:

```bash
postgraphile --help
```

### Middleware

You can also use PostGraphile as [native HTTP, Connect, Express, or Koa (experimental) middleware](https://www.graphile.org/postgraphile/usage-library/), e.g.:

```js
import { createServer } from 'http';
import postgraphile from 'postgraphile';

createServer(postgraphile());
```

Check out [hapi-postgraphile](https://github.com/mshick/hapi-postgraphile) if you're interested in using PostGraphile as a [hapi](https://github.com/hapijs/hapi) server plugin.

### Docker

To run via Docker, simply pass the [CLI options](https://www.graphile.org/postgraphile/usage-cli/) to the Docker container:

```bash
docker pull graphile/postgraphile
docker run graphile/postgraphile --help
```

E.g. you might run this command (substituting the relevant variables):

```bash
docker run -p 5000:5000 graphile/postgraphile --connection postgres://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:POSTGRES_PORT/POSTGRES_DATABASE --schema app_public --watch
```

## Read More

**Full documentation for PostGraphile is located at [graphile.org/postgraphile](https://graphile.org/postgraphile).**

PostGraphile features include:

- Authorization (security) provided by PostgreSQL:
  - [role-based access control (RBAC)](https://www.postgresql.org/docs/10/static/sql-grant.html)
  - [row-level security (RLS)][row-level-security]
- [Automatic GraphQL relations from SQL relations](https://www.graphile.org/postgraphile/relations/)
- [PostgreSQL procedure support][procedure documentation]:
  - [Custom queries][advanced queries documentation]
  - [Custom mutations](https://www.graphile.org/postgraphile/custom-mutations/)
  - [Computed columns](https://www.graphile.org/postgraphile/computed-columns/)
- Development UI (GraphiQL) built in
- `--watch` mode, auto-detects changes in SQL schema, hot-reloads changes into GraphiQL
- [Automatic documentation, enhanced by PostgreSQL `COMMENT`s](http://www.postgresql.org/docs/current/static/sql-comment.html)
- [Schema customisation through smart comments](https://www.graphile.org/postgraphile/smart-comments/)
- [Simple JWT authentication straight from the database](https://www.graphile.org/postgraphile/security/)
- [Cursor-based pagination, Relay (classic & modern) compatible](https://www.graphile.org/postgraphile/connections/)
- Global object identifiers (`nodeId` by default, but Relay-favoured `id` with `--classic-ids`)
- Relay-compatible mutations
- [Use direct from the CLI](https://www.graphile.org/postgraphile/usage-cli/)
- [Use as Express, Connect, or Koa middleware](https://www.graphile.org/postgraphile/usage-library/)
- [Just use the generated GraphQL schema](https://www.graphile.org/postgraphile/usage-schema/)

[procedure documentation]: https://www.graphile.org/postgraphile/procedures/
[advanced queries documentation]: https://www.graphile.org/postgraphile/custom-queries/
[row-level-security]: http://www.postgresql.org/docs/current/static/ddl-rowsecurity.html

## Requirements

- Node v8.6+
- PostgreSQL 9.6+ (currently works with 9.4+)
- Linux, macOS or Windows

Caveats:

- PostGraphile does not have automated tests on Windows, if you notice any
  issues please file them (or send a PR!)

## Supporting PostGraphile

The fastest and easiest way you can help PostGraphile thrive is by [sponsoring
ongoing development and maintenance](https://graphile.org/donate).

Want to help testing and developing PostGraphile? Check out the [contributing
document](CONTRIBUTING.md) to get started quickly!

Commercial support, consultancy and development services are available direct
from the maintainer; see [Professional Services](https://www.graphile.org/support/)
for more information, or get in touch!

The maintainer of this project is [@Benjie](https://twitter.com/benjie) -
follow him on Twitter!

## Thanks

Huge thanks to [the individuals and companies who sponsor PostGraphile's
development](SPONSORS.md) - their financial contributions enable more time to
be spent on the project: from bug fixes, to code review, to new features! If
you want to help the project advance more rapidly, please join them in
[supporting this project](https://graphile.org/donate) 🙏

A humongous, heart-felt, thank you to the original author of PostGraphile -
[Caleb Meredith](https://twitter.com/calebmer) - for everything he put into
PostGraphile! He's now graduated from the project and we all wish him the best
for his future ventures!

Thanks also to the people working on
[PostgREST](https://github.com/begriffs/postgrest) which was a huge inspiration
for this project!

Thanks and enjoy 👍
