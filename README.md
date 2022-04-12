# Graphile GraphQL Monorepo

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

At Graphile we love GraphQL so much we named ourself for our love of it! This
repository houses many of the Graphile packages that relate to GraphQL; the two
headline projects are **DataPlanner** and **PostGraphile** but there's many
other packages, a fair few of which can be used independently - see below for
more details.

**[DataPlanner][dataplanner]**: A cutting-edge planning and execution engine for
GraphQL.js ─ write your GraphQL schema with "plans" rather than "resolvers" and
our intelligent engine can optimize execution for incredible performance and
efficiency gains despite very attractive developer ergonomics. With batching
hard wired into the design, use this if you like to build your own GraphQL
schemas and want the best performance with minimal developer effort.

**[PostGraphile][postgraphile]**: An incredibly low-effort way to build a well
structured and high-performance GraphQL API backed primarily by a PostgreSQL
database. Our main focusses are performance, automatic best-practices and
customisability/extensibility. Use this if you have a PostgreSQL database and
you want to use it as the "source of truth" for an auto-generated GraphQL API
(which you can still make significant changes to). **NOTE**: thanks to
[graphile-exporter][] you can also use this as a starting point for an API that
you then manage yourself.

## Project summaries

Here's a rough breakdown of the main packages:

- **[dataplanner][]** - standalone cutting-edge planning and execution engine
  for GraphQL; see above for full description.
  - **[@dataplan/pg][]** - plan classes for interacting with PostgreSQL
  - **[@dataplan/json][]** - plan classes for encoding/decoding JSON
- **[graphile-exporter][]** - a package that can (under the right circumstances)
  export an in-memory dynamically-constructed GraphQL schema to raw JavaScript
  source code that can be imported and executed
  - **[eslint-plugin-graphile-exporter][]** - an ESLint plugin that helps you
    write code compatible with graphile-exporter
- **[jest-serializer-graphql-schema][]** - a simple Jest serializer that
  understands GraphQL schemas and thus does not fill snapshots with `\"\"\"`
  etc.
- **[graphile-plugin][]** - a module that handles the plugins, presets and
  configuration files for Graphile software - a universal configuration layer.
- **[graphile-build][]** - a system for building a GraphQL.js schema from
  "plugins", particularly useful for auto-generated GraphQL APIs (e.g.
  PostGraphile uses this) but also useful for hand-rolled schemas that have a
  lot of modular but widely-used concerns such as connections, naming, etc.
  - **[graphile-build-pg][]** - plugins for `graphile-build` that understand
    `@dataplan/pg` (i.e. PostgreSQL) data sources and can generate types,
    relations, mutations, etc for these database resources.
- **[graphile-lru][]** - an _obsessively_ performant least-recently-used cache
  (possibly the fastest general purpose LRU cache in Node.js) with a
  ridiculously tiny feature set; you almost certainly want @isaacs' `lru-cache`
  instead of this.
- **[pg-sql2][]** - a library for building highly dynamic SQL-injection-proof
  PostgreSQL queries using tagged template literals.
- **[pg-introspection][]** - a strongly typed introspection library for
  PostgreSQL, generated from the PostgreSQL documentation to provide up-to-date
  details of each introspection field.
- **[postgraphile][]** - pulls most of the above technologies together; see
  above for full description.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://surge.io/"><img src="https://graphile.org/images/sponsors/surge.png" width="90" height="90" alt="Surge" /><br />Surge</a> *</td>
<td align="center"><a href="https://storyscript.com/?utm_source=postgraphile"><img src="https://graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Story.ai" /><br />Story.ai</a> *</td>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.fanatics.com/"><img src="https://graphile.org/images/sponsors/fanatics.png" width="90" height="90" alt="Fanatics" /><br />Fanatics</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Development

### Requirements

Node 16 or above

### Set up

We use `yarn` to manage this monorepo; we strongly recommend that you only use
`yarn` when dealing with it - not `npm`, `pnpm` or similar. (Not because these
technologies are in any way inferior to `yarn`, simply because they're not 100%
compatible with each other and we require that you use `yarn` to contribute.)

Install the dependencies with `yarn`, and then run `yarn watch` which will
compile all the source code with `tsc` (TypeScript) and will keep watching the
filesystem for changes. (You can do `yarn build` for a one-time build if you
prefer.)

```bash
yarn
yarn watch # or 'yarn build'
```

**TODO:** check the following instructions work on a clean checkout.

We assume you have a local PostgreSQL server running in "trust" authentication
mode. Other options may or may not work.

First, create a database for running the tests: `createdb graphile_graphql_test`

Then tell our system this is the database you're using (you'll need to do this
each time you run the tests in a new terminal):

```bash
export TEST_DATABASE_URL="postgres:///graphile_graphql_test"
```

Then run the tests with `yarn test`

If the above succeeds, you're good to go! If not, please try again after running
`yarn install --force` and always feel free to reach out via
[our discord chat](http://discord.gg/graphile) on the #core-development channel.

### Working with Docker

**TODO:** the below is outdated.

If you want to work in a Docker environment you can follow
[the instructions on the wiki](https://github.com/graphile/graphile-build/wiki/Development-with-docker-compose).

[dataplanner]: packages/dataplanner/
[@dataplan/pg]: packages/dataplan-pg/
[@dataplan/json]: packages/dataplan-json/
[graphile-exporter]: packages/graphile-exporter/
[eslint-plugin-graphile-exporter]: packages/eslint-plugin-graphile-exporter/
[jest-serializer-graphql-schema]: packages/jest-serializer-graphql-schema/
[graphile-plugin]: packages/graphile-plugin/
[postgraphile]: packages/postgraphile/
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[graphile-lru]: packages/graphile-lru/
[pg-sql2]: packages/pg-sql2/
[pg-introspection]: packages/pg-introspection/
