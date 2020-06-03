<img width="100" height="100" title="Graphile logo" src="https://cdn.rawgit.com/graphile/graphile.github.io/a6225f8c3052df5c276ecef28aeb0cade1aec16a/logos/graphile.optimized.svg" />

# PostGraphile / Graphile Engine monorepo

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

Graphile Engine enables you to build high-performance easily-extensible GraphQL
schemas by combining plugins. PostGraphile builds on Graphile Engine to helps
you craft a best practices GraphQL API backed primarily by your PostgreSQL
database in record time.

This monorepo contains the main packages that make up the PostGraphile /
Graphile Engine suite.

## This is (unreleased) version 5!

**IMPORTANT**: this `master` branch shows the in-progress development on version
5 of the Graphile suite.
[For PostGraphile version 4, see the v4 branch](https://github.com/graphile/postgraphile/tree/v4).
Version 4 is still alive and well.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://storyscript.io/?utm_source=postgraphile"><img src="https://graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Storyscript" /><br />Storyscript</a> *</td>
<td align="center"><a href="https://postlight.com/?utm_source=graphile"><img src="https://graphile.org/images/sponsors/postlight.png" width="90" height="90" alt="Postlight" /><br />Postlight</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Monorepo Contents

### [postgraphile][] [![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/package/postgraphile) ![MIT license](https://img.shields.io/npm/l/postgraphile.svg) ![npm](https://img.shields.io/npm/dw/postgraphile)

Instant lightning-fast GraphQL API backed primarily by your PostgreSQL database.
Highly customizable and extensible thanks to incredibly powerful plugin system.

### [graphile-build][] [![Package on npm](https://img.shields.io/npm/v/graphile-build.svg?style=flat)](https://www.npmjs.com/package/graphile-build) ![MIT license](https://img.shields.io/npm/l/graphile-build.svg) ![npm](https://img.shields.io/npm/dw/graphile-build)

The core of Graphile Engine: a plugin system that enables you to build a GraphQL
schema out of plugins with advanced performance capabilities enabled via GraphQL
look-ahead functionality.

### [graphile-build-pg][] [![Package on npm](https://img.shields.io/npm/v/graphile-build-pg.svg?style=flat)](https://www.npmjs.com/package/graphile-build-pg) ![MIT license](https://img.shields.io/npm/l/graphile-build-pg.svg) ![npm](https://img.shields.io/npm/dw/graphile-build-pg)

A selection of graphile-build plugins related to PostgreSQL: schema
introspection, generation of fields and types for all tables, computed columns,
query procedures, etc - if there's certain features you don't want, simply don't
use that plugin!

### [graphile-utils][] [![Package on npm](https://img.shields.io/npm/v/graphile-utils.svg?style=flat)](https://www.npmjs.com/package/graphile-utils) ![MIT license](https://img.shields.io/npm/l/graphile-utils.svg) ![npm](https://img.shields.io/npm/dw/graphile-utils)

A collection of helper utilities to make writing graphile-build plugins easier.

### [postgraphile-core][] [![Package on npm](https://img.shields.io/npm/v/postgraphile-core.svg?style=flat)](https://www.npmjs.com/package/postgraphile-core) ![MIT license](https://img.shields.io/npm/l/postgraphile-core.svg) ![npm downloads](https://img.shields.io/npm/dw/postgraphile-core)

Contains the GraphQL schema functionality of [PostGraphile][], does not contain
the web layer.

### [graphql-parse-resolve-info][] [![Package on npm](https://img.shields.io/npm/v/graphql-parse-resolve-info.svg?style=flat)](https://www.npmjs.com/package/graphql-parse-resolve-info) ![MIT license](https://img.shields.io/npm/l/graphql-parse-resolve-info.svg) ![npm downloads](https://img.shields.io/npm/dw/graphql-parse-resolve-info)

Parses a `GraphQLResolveInfo` object into a tree of the fields that are being
requested to enable optimizations to your GraphQL schema (e.g. we use it in
`graphile-build-pg` to determine which fields are required from the SQL
database).

### [pg-sql2][] [![Package on npm](https://img.shields.io/npm/v/pg-sql2.svg?style=flat)](https://www.npmjs.com/package/pg-sql2) ![MIT license](https://img.shields.io/npm/l/pg-sql2.svg) ![npm downloads](https://img.shields.io/npm/dw/pg-sql2)

Create highly dynamic SQL in a powerful and flexible manner without opening
yourself to SQL injection attacks. (High performance.)

## Development

Below is a quick-start, for more detailed instructions, please
[see the CONTRIBUTING.md documentation in PostGraphile](https://github.com/graphile/postgraphile/blob/master/CONTRIBUTING.md).

```bash
yarn
yarn watch
```

`yarn watch` will keep monitoring and compiling the babel files, so open another
terminal to run the tests (Note: your PostgreSQL server must be
[configured for logical decoding](packages/lds/README.md#postgresql-configuration)):

```bash
createdb graphileengine_test
export TEST_DATABASE_URL="postgres:///graphileengine_test"
createdb lds_test
export LDS_TEST_DATABASE_URL="postgres:///lds_test"
yarn test
```

If the above succeeds, you're good to go! If not, please try again after running
`yarn install --force` and always feel free to reach out via
[our discord chat](http://discord.gg/graphile) on the #core-development channel.

### Working with Docker

If you want to work in a Docker environment you can follow
[the instructions on the wiki](https://github.com/graphile/graphile-build/wiki/Development-with-docker-compose).

[postgraphile]: packages/postgraphile/
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[graphile-utils]: packages/graphile-utils/
[postgraphile-core]: packages/postgraphile-core/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
[pg-sql2]: packages/pg-sql2/
