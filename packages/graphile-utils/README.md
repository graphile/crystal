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
