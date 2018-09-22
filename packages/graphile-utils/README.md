# graphile-utils

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/donate-via%20Patreon-orange.svg" alt="Patreon donate button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-utils.svg?style=flat)](https://www.npmjs.com/package/graphile-utils)
![MIT license](https://img.shields.io/npm/l/graphile-utils.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

This package contains helpers for building plugins for GraphQL schemas
utilising Graphile Engine, such as the one produced by
[PostGraphile](https://graphile.org/postgraphile).

Documentation is currently available
[here](https://graphile.org/postgraphile/extending/#the-easy-way-graphile-utils).

PRs to improve documentation are always welcome!

### `gql`

Similar to the default export from `graphql-tag`, this export can be used to
form tagged template literals that are useful when building schema
extensions. `gql` in `graphile-utils` differs from `graphql-tag` in a number
of ways, most notably: it can use interpolation to generate dynamically named
fields and types, and it can embed raw values using the `embed` helper.

### `embed`

Used to wrap a value to be included in a `gql` AST, e.g. for use in GraphQL
directives.

### `makeExtendPluginSchema`

Enables you to add additonal types or extend existing types within your
Graphile Engine GraphQL schema.

```js
const {
  makeExtendSchemaPlugin,
  gql,
} = require('graphile-utils');

const MySchemaExtensionPlugin =
  makeExtendSchemaPlugin(
    build => ({
      typeDefs: gql`...`,
      resolvers: ...
    })
  );

module.exports = MySchemaExtensionPlugin;
```

e.g.:

```js
makeExtendSchemaPlugin(build => ({
  typeDefs: gql`
    type Random {
      float: Float!
      number(min: Int!, max: Int!): Int!
    }
    extend type Query {
      random: Random
    }
  `,
  resolvers: {
    Query: {
      random() {
        return {};
      },
    },
    Random: {
      float() {
        return Math.random();
      },
      number(_parent, { min, max }) {
        return min + Math.floor(Math.random() * (max - min + 1));
      },
    },
  },
}));
```

### `makeAddInflectorsPlugin`

If you don't like the default naming conventions that come with a Graphile
Engine GraphQL schema then it's easy for you to override them using the
inflector.

For example, if you want '\*Patch' types to instead be called '\*ChangeSet'
you could make a plugin such as this one:

```js
const { makeAddInflectorsPlugin } = require('graphile-utils');

module.exports = makeAddInflectorsPlugin({
  patchType(typeName: string) {
    return this.upperCamelCase(`${typeName}-change-set`);
  },
});
```

The default Graphile Engine inflectors (`pluralize`, `singularize`,
`upperCamelCase`, `camelCase` and `constantCase`) can be found
[here](https://github.com/graphile/graphile-engine/blob/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09/packages/graphile-build/src/makeNewBuild.js#L811-L815).

The additional inflectors used in PostGraphile can be found [here](https://github.com/graphile/graphile-engine/blob/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09/packages/graphile-build-pg/src/plugins/PgBasicsPlugin.js#L296-L699).