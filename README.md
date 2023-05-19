# SPONSORS-ONLY PERIOD

**Hello and thanks for being one of the first people to look at PostGraphile and
Graphile Engine V5!**

Though this repository is MIT licensed, we're not ready for it to go public yet.
**Please do not share this code** beyond your company/organization. Preferably,
don't even share details of the new features!

**STATUS**: you should assume everything in this repository is highly unstable
and liable to change. This is a technology preview to help us shape the best
possible software for GraphQL, it's not ready for you to run in production...
yet!

**GETTING STARTED**: I'm afraid since our focus has been on the core technology,
the "awesome DX" parts haven't been finished yet (and in some cases haven't even
been started!) We suggest that you start by cloning down the repository, then
running the following:

```
yarn
yarn watch
```

This'll keep the compiled code up to date.

First step is probably to run PostGraphile, to do so:

```
cd postgraphile/postgraphile
# This next line is optional, among other things it adds indentation to the SQL
export GRAPHILE_ENV=development
yarn postgraphile -e -c postgres:///your_db_here
```

This should run PostGraphile [at http://localhost:5678](http://localhost:5678).
It may take a good few seconds to load GraphiQL the first time... I should look
into that. If you go to `Panels > Explain` then when you run queries you'll be
able to see the Grafast query plan (and the SQL queries) in the resizeable panel
at the bottom.

Should you wish to get your feet a little wetter, have a look at
[graphile-build/graphile-build-pg/src/examples/README.md](graphile-build/graphile-build-pg/src/examples/README.md)
and follow the guidance there, try out a couple examples, etc.

**DOCS**: I've put a fair amount of effort into documenting various of the
functions/variables in the codebase, but there's very little in the way of
user-docs right now. Further, quite a lot of stuff is in flux (e.g. we're moving
from "execution-v1" to "execution-v2"), so I've not bothered to document stuff
I'm planning to remove before release. Please don't hesitate to ask me questions
in the #🔮 channel [on Discord](https://discord.gg/graphile), or file an issue.
I won't be investing significant time in documentation until the codebase is a
little further along.

Also, **please look at the
[discussions](https://github.com/benjie/postgraphile-private/discussions)** - we
need your feedback!

---

# Graphile GraphQL Monorepo

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

At Graphile we love GraphQL so much we named ourself for our love of it! This
repository houses many of the Graphile packages that relate to GraphQL; the two
headline projects are **Grafast** and **PostGraphile** but there's many other
packages, a fair few of which can be used independently - see below for more
details.

**[Grafast][grafast]**: A cutting-edge planning and execution engine for
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
[graphile-export][] you can also use this as a starting point for an API that
you then manage yourself.

## Project summaries

Here's a rough breakdown of the main packages:

- **[grafast][]** - standalone cutting-edge planning and execution engine for
  GraphQL; see above for full description.
  - **[@dataplan/pg][]** - plan classes for interacting with PostgreSQL
  - **[@dataplan/json][]** - plan classes for encoding/decoding JSON
- **[graphile-export][]** - a package that can (under the right circumstances)
  export an in-memory dynamically-constructed GraphQL schema to raw JavaScript
  source code that can be imported and executed
  - **[eslint-plugin-graphile-export][]** - an ESLint plugin that helps you
    write code compatible with graphile-export
- **[jest-serializer-graphql-schema][]** - a simple Jest serializer that
  understands GraphQL schemas and thus does not fill snapshots with `\"\"\"`
  etc.
- **[graphile-config][]** - a module that handles the plugins, presets and
  configuration files for Graphile software - a universal configuration layer.
- **[graphile-build][]** - a system for building a GraphQL.js schema from
  "plugins", particularly useful for auto-generated GraphQL APIs (e.g.
  PostGraphile uses this) but also useful for hand-rolled schemas that have a
  lot of modular but widely-used concerns such as connections, naming, etc.
  - **[graphile-build-pg][]** - plugins for `graphile-build` that understand
    `@dataplan/pg` (i.e. PostgreSQL) services and can generate types, relations,
    mutations, etc for these database resources.
- **[@graphile/lru][]** - an _obsessively_ performant least-recently-used cache
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
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
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

[grafast]: grafast/grafast/
[@dataplan/pg]: grafast/dataplan-pg/
[@dataplan/json]: grafast/dataplan-json/
[graphile-export]: utils/graphile-export/
[eslint-plugin-graphile-export]: utils/eslint-plugin-graphile-export/
[jest-serializer-graphql-schema]: utils/jest-serializer-graphql-schema/
[graphile-config]: utils/graphile-config/
[postgraphile]: postgraphile/postgraphile/
[graphile-build]: graphile-build/graphile-build/
[graphile-build-pg]: graphile-build/graphile-build-pg/
[@graphile/lru]: utils/lru/
[pg-sql2]: utils/pg-sql2/
[pg-introspection]: utils/pg-introspection/
