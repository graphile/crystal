# graphile-utils

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-utils.svg?style=flat)](https://www.npmjs.com/package/graphile-utils)
![MIT license](https://img.shields.io/npm/l/graphile-utils.svg)
[![Follow](https://img.shields.io/badge/BSky-@Graphile.org-006aff.svg)](https://bsky.app/profile/graphile.org)
[![Follow](https://img.shields.io/badge/Mastodon-@Graphile.fosstodon.org-6364ff.svg)](https://fosstodon.org/@graphile)

This package contains helpers for building plugins for GraphQL schemas utilising
Graphile Build, such as the one produced by
[PostGraphile](https://postgraphile.org).

Documentation is currently available
[here](https://postgraphile.org/postgraphile/next/extending/).

PRs to improve documentation are always welcome!

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

### `extendSchema`

Docs: https://postgraphile.org/postgraphile/next/extend-schema

Enables you to add additonal types or extend existing types within your Graphile
Engine GraphQL schema.

```js
import { extendSchema } from 'graphile-utils';

const MySchemaExtensionPlugin =
  extendSchema(
    build => ({
      typeDefs: /* GraphQL */ `...`,
      objects: {...},
      interfaces: {...},
      unions: {...},
    })
  );

export default MySchemaExtensionPlugin;
```

e.g.:

```js
export default extendSchema((build) => {
  const {
    grafast: { constant },
  } = build;
  return {
    typeDefs: /* GraphQL */ `
      type Random {
        float: Float!
        number(min: Int!, max: Int!): Int!
      }
      extend type Query {
        random: Random
      }
    `,
    objects: {
      Query: {
        plans: {
          random() {
            return constant({});
          },
        },
      },
      Random: {
        plans: {
          float() {
            return lambda(null, () => Math.random());
          },
          number(_parent, { $min, $max }) {
            return lambda(
              [$min, $max],
              ([min, max]) => min + Math.floor(Math.random() * (max - min + 1)),
            );
          },
        },
      },
    },
  };
});
```

#### `gql`

Similar to the default export from `graphql-tag`, this export can be used to
form tagged template literals that are useful when building schema extensions.
`gql` in `graphile-utils` differs from `graphql-tag` in a number of ways, most
notably: it can use interpolation to generate dynamically named fields and
types, and it can embed raw values using the `embed` helper.

```ts
extendSchema({ typeDefs: gql`...` });
```

#### `embed`

Used to wrap a value to be included in a `gql` AST, e.g. for use in GraphQL
directives.

```ts
extendSchema({ typeDefs: gql`...${embed(...)}...` });
```

### `changeNullability`

Docs: https://postgraphile.org/postgraphile/next/change-nullability

Use this plugin to override the nullability of fields in your GraphQL schema.

### `processSchema`

Docs: https://postgraphile.org/postgraphile/next/process-schema

Enables you to process the schema after it's built, e.g. print it to a file,
augment it with a third party library (e.g. graphql-shield), etc.

### `wrapPlans`

Docs: https://postgraphile.org/postgraphile/next/wrap-plans

Enables you to wrap the field plan resolvers in the generated Grafast schema,
allowing you to augment the way in which existing fields operate.

## Developing

### Testing

Make sure you first follow the instructions in the
[CONTRIBUTING.md file at the root of the repository](../../CONTRIBUTING.md),
then run the test with the following commands:

```bash
yarn build
yarn test
```
