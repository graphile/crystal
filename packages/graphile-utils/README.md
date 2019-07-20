# graphile-utils

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-utils.svg?style=flat)](https://www.npmjs.com/package/graphile-utils)
![MIT license](https://img.shields.io/npm/l/graphile-utils.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

This package contains helpers for building plugins for GraphQL schemas
utilising Graphile Engine, such as the one produced by
[PostGraphile](https://graphile.org/postgraphile).

Documentation is currently available
[here](https://graphile.org/postgraphile/extending/).

PRs to improve documentation are always welcome!

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask
all individuals and businesses that use it to help support its ongoing
maintenance and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website/"><img src="https://www.graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a></td>
<td align="center"><a href="https://timescale.com/"><img src="https://www.graphile.org/images/sponsors/timescale.svg" width="90" height="90" alt="Timescale" /><br />Timescale</a></td>
</tr></table>

<!-- SPONSORS_END -->

### `gql`

Similar to the default export from `graphql-tag`, this export can be used to
form tagged template literals that are useful when building schema
extensions. `gql` in `graphile-utils` differs from `graphql-tag` in a number
of ways, most notably: it can use interpolation to generate dynamically named
fields and types, and it can embed raw values using the `embed` helper.

### `embed`

Used to wrap a value to be included in a `gql` AST, e.g. for use in GraphQL
directives.

### `makeExtendSchemaPlugin`

Docs: https://www.graphile.org/postgraphile/make-extend-schema-plugin/

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

Docs: https://www.graphile.org/postgraphile/make-add-inflectors-plugin/

If you don't like the default naming conventions that come with a Graphile
Engine GraphQL schema then it's easy for you to override them using the
inflector.

### `makeChangeNullabilityPlugin`

Docs: https://www.graphile.org/postgraphile/make-change-nullability-plugin/

Use this plugin to override the nullability of fields in your GraphQL schema.

### `makeProcessSchemaPlugin`

Docs: https://www.graphile.org/postgraphile/make-process-schema-plugin/

Enables you to process the schema after it's built, e.g. print it to a file,
augment it with a third party library (e.g. graphql-shield), etc.

### `makeWrapResolversPlugin`

Docs: https://www.graphile.org/postgraphile/make-wrap-resolvers-plugin/

Enables you to wrap the field resolvers in the generated GraphQL API,
allowing you to take an action before or after the resolver, or even modify
the resolver result.
