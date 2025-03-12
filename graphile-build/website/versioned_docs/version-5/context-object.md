---
layout: page
path: /graphile-build/context-object/
title: The Context Object
sidebar_position: 7
---

Whereas the `Build` object is the same for all hooks (except the `build` hook
which constructs it) within an individual build, the `Context` object changes
for each hook. Different hooks have different values available to them on the
`Context` object; you can explore what they are through TypeScript auto-completion.

The main ones are:

### `scope`

An object based on the second argument to `register*Type` or `fieldWithHooks` -
this is useful for filtering which objects a particular hook should apply to.

For deeper hooks (such as `GraphQLObjectType_fields_field`) the scope from
shallower hooks (such as `GraphQLObjectType`) are merged in; it's thus
advisable to ensure that field hooks contain the word `field` in each of the
scopes added, and so on.

For example you might use a hook such as this to add a description to the
`clientMutationId` field on all mutation input objects:

```js
const MyPlugin = {
  name: "MyPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      GraphQLInputObjectType_fields_field(
        field,
        { extend },
        { scope: { isMutationInput, fieldName } },
      ) {
        // highlight-start
        if (
          !isMutationInput ||
          fieldName !== "clientMutationId" ||
          field.description != null
        ) {
          return field;
        }
        return extend(field, {
          description:
            "An arbitrary string value with no semantic meaning. " +
            "Will be included in the payload verbatim. " +
            "May be used to track mutations by the client.",
        });
        // highlight-end
      },
    },
  },
};
```

### `Self`

Whilst only available on hooks that are called after the object is created (e.g.
`GraphQLObjectType_fields`), this field is useful because it contains the object
that has been created; allowing circular references to be built. A common
use-case for this is the root `Query` object referencing itself with the `query`
field to work around some issues in Relay 1.

### `fieldWithHooks(scope, spec)`

Available on hooks `GraphQLObjectType_fields` and
`GraphQLInputObjectType_fields`, this function is useful for providing scopes
so that fields can be hooked by other plugins. If you don't call this, it will
be called for you at a later time.

```js
const MyPlugin = {
  name: "MyPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      GraphQLInputObjectType_fields(fields, build, context) {
        const {
          extend,
          graphql: { GraphQLNonNull, GraphQLString },
        } = build;
        // highlight-next-line
        const { fieldWithHooks } = context;
        // TODO: if (...) return fields;
        return extend(
          fields,
          {
            // highlight-start
            helloWorld: fieldWithHooks(
              // The scope
              { fieldName: "helloWorld", isHelloWorldField: true },

              // The spec generator
              () => ({
                type: new GraphQLNonNull(GraphQLString),
                plan() {
                  return constant("Hello World");
                },
              }),
            ),
            // highlight-end
          },
          "Adding helloWorld from 'MyPlugin'",
        );
      },
    },
  },
};
```

<!-- TODO: add more context properties -->
