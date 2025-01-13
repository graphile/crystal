---
layout: page
path: /graphile-build/default-plugins/
title: Default Plugins
---

The following plugins come bundled with `graphile-build` as `defaultPlugins` and
it's recommended to use them in your schemas.

### StandardTypesPlugin

Declares `Cursor`, `UUID`, `JSON` and `PageInfo` types you can get from
`build.getTypeByName('Cursor')` etc.

### NodePlugin

Implements some foundations for the
[Relay Global Object Identification Specification](https://facebook.github.io/relay/graphql/objectidentification.htm) -
adds `id` (or whatever you set as `nodeIdFieldName`) to `Query` and allows you
to look up registered nodes by their `id`.

<!-- TODO: document how! -->

### QueryPlugin

Defines the `Query` object and hooks `GraphQLSchema` to add it in. To hook this,

```js
function MyPlugin(builder) {
  builder.hook(
    "GraphQLObjectType",
    (spec, { extend }, { scope: { isRootQuery } }) => {
      if (!isRootQuery) {
        return spec;
      }

      return extend(spec, {
        //... Add new query fields here
      });
    }
  );
}
```

### MutationPlugin

Defines the `Mutation` object and hooks `GraphQLSchema` to add it in. Will only
be added to the Schema if a hook adds fields to it.

```js
function MyPlugin(builder) {
  builder.hook(
    "GraphQLObjectType",
    (spec, { extend }, { scope: { isRootMutation } }) => {
      if (!isRootMutation) {
        return spec;
      }

      return extend(spec, {
        //... Add new mutation fields here
      });
    }
  );
}
```

### ClientMutationIdDescriptionPlugin

Adds a description to `clientMutationId` field...

### MutationPayloadQueryPlugin

Adds `query` to mutation payloads so that you can query any data you like after
the mutation has resolved.
