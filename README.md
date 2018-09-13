<img width="100" height="100" title="Graphile logo" src="https://cdn.rawgit.com/graphile/graphile.github.io/a6225f8c3052df5c276ecef28aeb0cade1aec16a/logos/graphile.optimized.svg" />

# Graphile Engine

![MIT license](https://img.shields.io/npm/l/graphile-build.svg)
[![Gitter chat room](https://badges.gitter.im/graphile/postgraphile.svg)](https://gitter.im/graphile/postgraphile?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development through Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
[![Follow](https://img.shields.io/badge/twitter-@benjie-blue.svg)](https://twitter.com/benjie)

Graphile Engine enables you to build high-performance easily-extensible GraphQL schemas by combining plugins.

**NOTE**: _You might be looking for [PostGraphile](https://github.com/graphile/postgraphile) which is the Graphile Engine applied to a PostgreSQL database._

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

**[graphql-parse-resolve-info][]**: Parses a GraphQLResolveInfo object into a
tree of the fields that are being requested to enable optimisations to your
GraphQL schema (e.g. we use it in graphile-build-pg to determine which fields
are required from the SQL database).

## History

A proof of concept was built by [Benjie](https://twitter.com/benjie) over a few
weeks back in 2017, growing out of a need for more efficient SQL queries,
easier extensibility and greater customisation in [PostGraphQL][postgraphile].
Over the next year thanks to the input of the community and ongoing development
and testing it matured into the production-ready system it is today.

We're extremely grateful to [Caleb Meredith][] for the stellar work he put into
PostGraphQL, and to the community who inspired the idea.

## Development

```
yarn
yarn lerna bootstrap
yarn watch
```

Watch will keep monitoring and compiling the babel files, so open another
terminal to run the tests:

```
createdb pggql_test
export TEST_DATABASE_URL="postgres:///pggql_test"
lerna run test
```

If the above succeeds, you're good to go! If not, please try again after
running `yarn install --force` and failing that reach out on twitter:
[@benjie](https://twitter.com/benjie).

### Working with Docker

If you want to work in a Docker environment you can follow
[the instructions on the wiki](https://github.com/graphile/graphile-build/wiki/Development-with-docker-compose).

[postgraphile]: https://github.com/graphile/postgraphile
[caleb meredith]: https://github.com/calebmer
[lerna]: https://github.com/lerna/lerna
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[graphile-utils]: packages/graphile-utils/
[postgraphile-core]: packages/postgraphile-core/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
