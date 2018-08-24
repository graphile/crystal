# graphile-utils

This package contains helpers for building plugins for Graphile-Build based
GraphQL schemas, such as the one in PostGraphile.

Documentation is currently available [here](https://graphile.org/postgraphile/extending/#the-easy-way-graphile-utils).

PRs to improve documentation are always welcome!

Typical usage:

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
