---
layout: page
path: /graphile-build/context-object/
title: The Context Object
sidebar_position: 7
---

Whereas the `Build` object is the same for all hooks (except the `build` hook
which constructs it) within an individual build, the `Context` object changes
for each hook. Different hooks have different values available on the `Context`
object; use TypeScript auto-completion to explore them.

## Common properties

All contexts include these properties:

- `type` - a string indicating the hook being executed. Possible values are
  `build`, `init`, `finalize`, `GraphQLSchema`, `GraphQLScalarType`,
  `GraphQLObjectType`, `GraphQLInterfaceType`, `GraphQLUnionType`,
  `GraphQLEnumType`, and `GraphQLInputObjectType`.
- `scope` - a structured object that explains why the hook was called.

## Scope specialisations

Every scope includes `directives?: DirectiveDetails[]`. Specialised scopes add
additional fields:

- `ScopeObject` - `isRootQuery`, `isRootMutation`, `isRootSubscription`,
  `isMutationPayload`, `isPageInfo`.
- `ScopeObjectFieldsField` - `fieldName`, `fieldBehaviorScope`,
  `fieldDirectives`, `isCursorField`.
- `ScopeObjectFieldsFieldArgsArg` - `argName`.
- `ScopeInterface` - `supportsNodeInterface`.
- `ScopeInterfaceFieldsField` - `fieldName`.
- `ScopeInterfaceFieldsFieldArgsArg` - `argName`.
- `ScopeInputObject` - `isMutationInput`.
- `ScopeInputObjectFieldsField` - `fieldName`, `fieldBehaviorScope`.
- `ScopeEnumValuesValue` - `valueName`.

For deeper hooks (such as `GraphQLObjectType_fields_field`) the scope from
shallower hooks (such as `GraphQLObjectType`) are merged in; ensure that field
hooks include `field` in their scope names to avoid collisions.

## Context variants

The hook name determines which specialised context is used. Contexts inherit
from their parent contexts, so properties like `Self` and `fieldWithHooks`
remain available on deeper hooks.

- `build` - `ContextBuild`
- `init` - `ContextInit`
- `finalize` - `ContextFinalize`
- `GraphQLSchema` - `ContextSchema`
- `GraphQLSchema_types` - `ContextSchemaTypes` (includes `config`)
- `GraphQLScalarType` - `ContextScalar`
- `GraphQLObjectType` - `ContextObject`
- `GraphQLObjectType_interfaces` - `ContextObjectInterfaces` (includes `Self`)
- `GraphQLObjectType_fields` - `ContextObjectFields` (includes `Self` and
  `fieldWithHooks`)
- `GraphQLObjectType_fields_field` - `ContextObjectFieldsField`
- `GraphQLObjectType_fields_field_args` - `ContextObjectFieldsFieldArgs`
- `GraphQLObjectType_fields_field_args_arg` - `ContextObjectFieldsFieldArgsArg`
- `GraphQLInputObjectType` - `ContextInputObject`
- `GraphQLInputObjectType_fields` - `ContextInputObjectFields` (includes `Self`
  and `fieldWithHooks`)
- `GraphQLInputObjectType_fields_field` - `ContextInputObjectFieldsField`
  (includes `Self`)
- `GraphQLEnumType` - `ContextEnum`
- `GraphQLEnumType_values` - `ContextEnumValues` (includes `Self` with `name`)
- `GraphQLEnumType_values_value` - `ContextEnumValuesValue`
- `GraphQLUnionType` - `ContextUnion`
- `GraphQLUnionType_types` - `ContextUnionTypes` (includes `Self`)
- `GraphQLInterfaceType` - `ContextInterface`
- `GraphQLInterfaceType_fields` - `ContextInterfaceFields` (includes `Self` and
  `fieldWithHooks`)
- `GraphQLInterfaceType_fields_field` - `ContextInterfaceFieldsField`
- `GraphQLInterfaceType_fields_field_args` - `ContextInterfaceFieldsFieldArgs`
- `GraphQLInterfaceType_fields_field_args_arg` -
  `ContextInterfaceFieldsFieldArgsArg`
- `GraphQLInterfaceType_interfaces` - `ContextInterfaceInterfaces` (includes
  `Self`)

## `fieldWithHooks(scope, spec)`

Available on `GraphQLObjectType_fields`, `GraphQLInputObjectType_fields`, and
`GraphQLInterfaceType_fields`, this function registers scope for a field and
returns the generated field spec. If you do not call it, Graphile Build will
call it later on your behalf.

For example, to add a description to the `clientMutationId` field on all
mutation input objects:

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

And to add a field while defining a scope:

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
        const { fieldWithHooks } = context;
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
