# GraphQL-Build

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/benjie)

Build a high-performance easily-extensible GraphQL schema by combining plugins.

_NOTE: you might actually be looking for PostGraphile (previously
'PostGraphQL') which can be found
[here](https://github.com/graphile/postgraphile); the schema building tools
in this repository are used to power PostGraphile among other things._

This repository is a monorepo (managed by [lerna][]) which comprises the following packages:

**[graphile-build][]**: The core package: a simple plugin system that enables you to build a GraphQL schema out of plugins

**[graphile-build-pg][]**: A selection of plugins related to PostgreSQL: schema
introspection, generation of fields and types for all tables, computed columns,
query procedures, etc - if there's certain features you don't want, simply
don't use that plugin! (Surfacing plugin dependencies has not been built yet,
so be careful when you disable a plugin.)

**[postgraphile-core][]**: Intended to be used by [PostGraphile][] in
order to provide its schema functionality (excluding HTTP handling, etc)

**[graphql-parse-resolve-info][]**: Parses a GraphQLResolveInfo object into a
tree of the fields that are being requested to enable optimisations to your
GraphQL schema (e.g. we use it to determine which fields are required from the
SQL database)

## Status

* [graphile-build][] - working (but needs tests, more documentation, refactoring,
  and probably needs to support more hooks)

* [graphile-build-pg][] / [postgraphile-core][] - working - passes the PostGraphQL v3
  integration tests for queries and mutations

* [graphql-parse-resolve-info][] - complete (but needs dedicated tests because
  it's currently only tested by virtue of the postgraphile-core tests depending
  on it)

## History

This system grew out of a need for more efficient SQL queries, easier
extensibility and customisation in [PostGraphQL][]. I'm extremely grateful to
[Caleb Meredith][] for the stellar work he put into PostGraphQL, and to the
community who helped me come up with this idea.

## Development

```
npm install -g lerna yarn
yarn
lerna bootstrap
npm run watch
```

Watch will keep monitoring and compiling the babel files. Then to run the tests in another terminal:

```
lerna run test
```

If the above succeeds, you're good to go! If not, please reach out on twitter:
[@benjie](https://twitter.com/benjie).

### Working with docker

If you want to work in a docker environment you can follow [the instructions on the wiki](https://github.com/graphile/graphile-build/wiki/Development-with-docker-compose).

### GraphQL conflict

If you get an error like the below:

`GraphQL conflict for 'GraphQLObjectType' detected! Multiple versions of graphql exist in your node_modules?`

it means the `peerDependencies` have been installed locally in each package
which is not what we want (we want them installed in the root `node_modules`.

To solve this, we need to re-bootstrap:

```
rm -Rf packages/*/node_modules
yarn
lerna bootstrap
```

[postgraphql]: https://github.com/graphile/postgraphile
[caleb meredith]: https://github.com/calebmer
[lerna]: https://github.com/lerna/lerna
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[postgraphile-core]: packages/postgraphile-core/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
