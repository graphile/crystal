---
title: Context Object
---

# The Context Object

Whereas the `Build` object is the same for all hooks (except the `build` hook
which constructs it) within an individual build, the `Context` object changes
for each hook. Different hooks have different values available to them on the
`Context` object and sadly we've not documented all these yet so you may have to
do some inspection!

The main ones are:

### `scope`

An object based on the third argument to `newWithHooks` or `fieldWithHooks` -
this is useful for filtering which objects a particular hook should apply to.

For deeper hooks (such as `GraphQLObjectType:fields:field`) the scope from
shallower hooks (such as `GraphQLObjectType`) are merged in.

For example you might use a hook such as this to add a description to the
`clientMutationId` field on all mutation input objects:

```js
builder.hook(
  "GraphQLInputObjectType:fields:field",
  (field, { extend }, { scope: { isMutationInput, fieldName } }) => {
    if (
      /* highlight-next-line */
      !isMutationInput ||
      fieldName !== "clientMutationId" ||
      /* highlight-start */
      field.description != null
    ) {
      return field;
    }
    return extend(field, {
      /* highlight-end */
      description:
        "An arbitrary string value with no semantic meaning. " +
        "Will be included in the payload verbatim. " +
        "May be used to track mutations by the client.",
    });
  },
);
```

### `Self`

Whilst only available on hooks that are called after the object is created (e.g.
`GraphQLObjectType:fields`), this field is useful because it contains the object
that has been created; allowing circular references to be built. A common
use-case for this is the root `Query` object referencing itself with the `query`
field to work around some issues in Relay 1.

### `fieldWithHooks(fieldName, spec, scope = {})`

Available on hooks `GraphQLObjectType:fields` and
`GraphQLInputObjectType:fields`, this function is useful for adding hooks early
(for example if you need to call `addDataGenerator(...)`). If you don't call
this, it will be called for you at a later time.

```js
builder.hook("GraphQLInputObjectType:fields",
  (
    fields,
    { extend, resolveAlias },
    /* highlight-next-line */
    { fieldWithHooks }
  ) => {
    // TODO: if (...) return fields;
    return extend(fields, {
      /* highlight-start */
      id: fieldWithHooks("id", ({ addDataGenerator }) => {
        addDataGenerator(({ alias }) => {
          return {
            map: obj => ({ [alias]: obj.ID }),
          };
        });
        return {
          type: new GraphQLNonNull(GraphQLString),
          resolve: resolveAlias,
        };
      }),
      /* highlight-end */
    };
  },
});
```

See also:
[Look ahead](/graphile-build/4/look-ahead/#when-creating-an-individual-field).

<!-- TODO: add more context properties -->
