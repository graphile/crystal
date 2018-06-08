<img width="100" height="100" title="Graphile logo" src="https://cdn.rawgit.com/graphile/graphile.github.io/a6225f8c3052df5c276ecef28aeb0cade1aec16a/logos/graphile.optimized.svg" />

# Graphile-Build

![MIT license](https://img.shields.io/npm/l/graphile-build.svg)
[![Gitter chat room](https://badges.gitter.im/graphile/postgraphile.svg)](https://gitter.im/graphile/postgraphile?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
[![Follow](https://img.shields.io/badge/twitter-@benjie-blue.svg)](https://twitter.com/benjie)

Build high-performance easily-extensible GraphQL schemas by combining plugins.

_NOTE: if you're looking for a performant GraphQL API based on a PostgreSQL database you're probably looking for [PostGraphile](https://github.com/graphile/postgraphile) (previously
'PostGraphQL'); the schema building tools in this repository are used to power PostGraphile among other things._

This repository is a monorepo (managed by [lerna][]):

**[graphile-build][]**: The core package: a simple plugin system that enables you to build a GraphQL schema out of plugins

**[graphile-build-pg][]**: A selection of plugins related to PostgreSQL: schema
introspection, generation of fields and types for all tables, computed columns,
query procedures, etc - if there's certain features you don't want, simply
don't use that plugin! (Surfacing plugin dependencies has not been built yet,
so be careful when you disable a plugin.)

**[postgraphile-core][]**: Intended to be used by [PostGraphile][] in
order to provide its GraphQL schema functionality (excluding HTTP handling, etc)

**[graphql-parse-resolve-info][]**: Parses a GraphQLResolveInfo object into a
tree of the fields that are being requested to enable optimisations to your
GraphQL schema (e.g. we use it to determine which fields are required from the
SQL database)

## History

This system was originally built by [Benjie](https://twitter.com/benjie) over a
couple of weeks as a proof of concept, growing out of a need for more efficient
SQL queries, easier extensibility and greater customisation in [PostGraphQL][postgraphile].
Over the next year thanks to the input of the community and ongoing development
and testing it matured into the production-ready system it is today. I'm
extremely grateful to [Caleb Meredith][] for the stellar work he put into
PostGraphQL, and to the community who helped me come up with this idea.

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

### Working with Docker

If you want to work in a Docker environment you can follow [the instructions on the wiki](https://github.com/graphile/graphile-build/wiki/Development-with-docker-compose).

### GraphQL conflict

If you get an error like the below:

`GraphQL conflict for 'GraphQLObjectType' detected! Multiple versions of graphql exist in your node_modules?`

it means the `peerDependencies` have been installed locally in each package
which is not what we want (we want them installed in the root `node_modules`).

To solve this, we need to re-bootstrap:

```
rm -Rf packages/*/node_modules
yarn
lerna bootstrap
```

[postgraphile]: https://github.com/graphile/postgraphile
[caleb meredith]: https://github.com/calebmer
[lerna]: https://github.com/lerna/lerna
[graphile-build]: packages/graphile-build/
[graphile-build-pg]: packages/graphile-build-pg/
[postgraphile-core]: packages/postgraphile-core/
[graphql-parse-resolve-info]: packages/graphql-parse-resolve-info/
