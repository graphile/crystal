# 🔮 Graphile's Crystal Monorepo

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

At Graphile we love GraphQL so much we named ourself for our love of it! This
repository houses many of the Graphile packages that relate to GraphQL (or
relate to the packages that relate to GraphQL, or relate to those package...);
the two headline projects are **Gra*fast*** and **PostGraphile** but there's
many other packages, a fair few of which can be used independently - see below
for more details.

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

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
</tr><tr>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
<td align="center"><a href="https://www.accenture.com/"><img src="https://graphile.org/images/sponsors/accenture.svg" width="90" height="90" alt="Accenture" /><br />Accenture</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Why the "crystal" monorepo?

Originally what is now Gra*fast* (and was previously DataPlanner) was known by
the codename "Graphile Crystal." This lead us to use the 🔮 emoji to represent
the project in secret before we announced it publicly, as a codeword for those
in the know. Now that Gra*fast* is the name for our planning and execution
engine and we needed a name for the monorepo that wasn't too GraphQL specific
(since there are things in here that aren't strictly related to GraphQL) and we
figured that calling it the Crystal monorepo would honour our original nickname
for the project. Rumours that the name was inspired by the maintainers'
[crystal wedding anniversary](https://en.wikipedia.org/wiki/Wedding_anniversary#Traditional_anniversary_gifts)
are greatly exaggerated.

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
