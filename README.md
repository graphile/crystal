<img width="100" height="100" title="Graphile logo" src="https://cdn.rawgit.com/graphile/graphile.github.io/a6225f8c3052df5c276ecef28aeb0cade1aec16a/logos/graphile.optimized.svg" />

# Graphile Engine

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-build.svg?style=flat)](https://www.npmjs.com/package/graphile-build)
![MIT license](https://img.shields.io/npm/l/graphile-build.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

Graphile Engine enables you to build high-performance easily-extensible GraphQL schemas by combining plugins.

**NOTE**: _You might be looking for [PostGraphile](https://github.com/graphile/postgraphile) which is Graphile Engine applied to a PostgreSQL database._

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask
all individuals and businesses that use it to help support its ongoing
maintenance and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://storyscript.com/?utm_source=postgraphile"><img src="https://graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Storyscript" /><br />Storyscript</a> *</td>
<td align="center"><a href="https://surge.io/"><img src="https://graphile.org/images/sponsors/surge.png" width="90" height="90" alt="Surge.io" /><br />Surge.io</a> *</td>
<td align="center"><a href="https://postlight.com/?utm_source=graphile"><img src="https://graphile.org/images/sponsors/postlight.jpg" width="90" height="90" alt="Postlight" /><br />Postlight</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Monorepo contents

**[graphile-build][]**: The core of Graphile Engine: a plugin system that
enables you to build a GraphQL schema out of plugins with advanced performance
capabilities enabled via GraphQL look-ahead functionality.

**[graphile-build-pg][]**: A selection of graphile-build plugins related to
PostgreSQL: schema introspection, generation of fields and types for all
tables, computed columns, query procedures, etc - if there's certain features
you don't want, simply don't use that plugin!

**[graphile-utils][]**: A collection of helper utilities to make writing
graphile-build plugins easier.

**[postgraphile-core][]**: Contains the GraphQL schema functionality of
[PostGraphile][], does not contain the web layer.

**[graphql-parse-resolve-info][]**: Parses a `GraphQLResolveInfo` object into a
tree of the fields that are being requested to enable optimisations to your
GraphQL schema (e.g. we use it in `graphile-build-pg` to determine which fields
are required from the SQL database).

## Brief History

Proof of concept was built by [@Benjie](https://twitter.com/benjie) in 2017,
growing out of a need for greater performance, easier extensibility and
greater customisation in [PostGraphQL][postgraphile]. Over the next year
thanks to the input of the community and ongoing development and testing,
Graphile Engine has matured into the production-ready system it is today.

## Development

Below is a quick-start, for more detailed instructions, please [see the
CONTRIBUTING.md documentation in PostGraphile](https://github.com/graphile/postgraphile/blob/master/CONTRIBUTING.md).

```bash
yarn
yarn lerna bootstrap
yarn watch
```

`yarn watch` will keep monitoring and compiling the babel files, so open
another terminal to run the tests (Note: your PostgreSQL server must be
[configured for logical decoding](packages/lds/README.md#postgresql-configuration)):

```bash
createdb graphileengine_test
export TEST_DATABASE_URL="postgres:///graphileengine_test"
yarn lerna run test
```

If the above succeeds, you're good to go! If not, please try again after
running `yarn install --force` and always feel free to reach out via [our
discord chat](http://discord.gg/graphile) on the #core-development channel.

### Working with Docker

If you want to work in a Docker environment you can follow
[the instructions on the wiki](https://github.com/graphile/graphile-build/wiki/Development-with-docker-compose).

[postgraphile]: https://github.com/graphile/postgraphile
[lerna]: https://github.com/lerna/lerna
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[graphile-utils]: packages/graphile-utils/
[postgraphile-core]: packages/postgraphile-core/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
