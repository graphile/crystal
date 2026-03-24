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

## Scope

When an entity (type, field, arg, etc) is registered or created, a scope object
is passed that provides details as to why that entity exists. Plugins can use
this scope to ensure that they only apply changes to relevant entities.

All plugins are free to add more scope values (and are actively encouraged to do
so!), but it's highly recommended to use a prefix to avoid conflicts. For deeper
hooks (such as `GraphQLObjectType_fields_field`) the scope from shallower hooks
(such as `GraphQLObjectType`) are merged in; it's recommended to use additional
scope-depth prefixes to avoid collisions (e.g. field scopes should include the
term `field` in their scope names).

Scope names are derived from the hook name, by removing `GraphQL` and `Type`,
camel-casing the result, and prefixing `Scope`, e.g. the scope for the `init`
hook is `ScopeInit` and for the `GraphQLObjectType_fields_field_args_arg` hook
is `ScopeObjectFieldsFieldArgsArg`.

For `ScopeObjectFieldsField`, `ScopeInterfaceFieldsField`,
`ScopeInputObjectFieldsField`, and all their descendents: `fieldName` is
guaranteed to exist.

For `ScopeObjectFieldsFieldArgsArg` and `ScopeInterfaceFieldsFieldArgsArg`:
`argName` is guaranteed to exist.

For `ScopeEnumValuesValue`: `valueName` is guaranteed to exist.

### Declaring scopes

To tell TypeScript about your custom scope values, declare them via declaration
merging, e.g.:

```ts
declare global {
  namespace GraphileBuild {
    interface ScopeObject {
      // Add your scope properties here:
      myCompanyIsRelevantType?: boolean;
    }
    interface ScopeObjectFieldsField {
      // Add your scope properties here:
      myCompanyIsRelevantField?: boolean;
    }
  }
}

const MyCompanyPlugin: GraphileConfig.Plugin = {
  name: "MyCompanyPlugin",
  schema: {
    hooks: {
      init(_, build) {
        for (let i = 0; i < 10; i++) {
          build.registerObjectType(
            `MyCompanyType${i}`,
            // Indicate this is our type
            { myCompanyIsRelevantType: true },
            () => ({ fields: {} }),
            "Reason we're defining this object type",
          );
        }

        return _;
      },
      GraphQLObjectType_fields(fields, build, context) {
        // Only hook our own types
        if (!context.scope.myCompanyIsRelevantType) return fields;

        // Register a new field on this type
        const fieldName = "myField";
        return build.extend(
          fields,
          {
            [fieldName]: context.fieldWithHooks(
              {
                fieldName, // Required
                // Indicate this is our field
                myCompanyIsRelevantField: true,
              },
              { type: GraphQLString },
            ),
          },
          "MyCompany adding myField to __MyObject__",
        );
      },
      GraphQLObjectType_fields_field(field, build, context) {
        // Only hook our own fields
        if (!context.scope.myCompanyIsRelevantField) return field;
        field.description = "Yay, I found it!";
        return field;
      },
    },
  },
};
```

## Context

The context object wraps the `scope` along with additional system-defined
details about the given entity.

Context names are derived from the hook name, by removing `GraphQL` and `Type`,
camel-casing the result, and prefixing `Context`, e.g. the context for the `init`
hook is `ContextInit` and for the `GraphQLObjectType_fields_field_args_arg` hook
is `ContextObjectFieldsFieldArgsArg`.

Contexts inherit from their parent contexts, so properties like `Self` and
`fieldWithHooks` remain available on deeper hooks.

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

### `Self`

The `context.Self` property is a reference to, where possible, the instance of
the GraphQL type. This is present for deferred hooks, and can be used to
determine whether or not to run the hooks logic.

### `fieldWithHooks(scope, spec)`

Fields can be registered directly, but doing so doesn't give other plugins
context as to whether the field should be augmented or not:

```ts title="Valid, but bad manners..."
// Don't do this!
const DontDoThisPlugin: GraphileBuild.Plugin = {
  name: "DontDoThisPlugin",
  description: "Don't do this!",
  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const isRelevant = determineIsRelevant(context);
        if (!isRelevant) return fields;

        // Don't do this, because other plugins can't easily hook it
        fields.myNewField = {
          description: "Special field from MyCompany",
          type: build.graphql.GraphQLBoolean,
        };

        return fields;
      },
    },
  },
};
```

Instead, use `context.fieldWithHooks(scope, spec)` so you can indicate additional scope information:

```ts
const DoThisInsteadPlugin: GraphileBuild.Plugin = {
  name: "DoThisInsteadPlugin",
  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const isRelevant = determineIsRelevant(context);
        if (!isRelevant) return fields;

        const fieldName = "myNewField";
        return build.extend(
          fields,
          {
            // Don't do this, because other plugins can't easily hook it
            [fieldName]: context.fieldWithHooks(
              {
                fieldName, // Required

                // Describe why this field exists; how might someone filter
                // so they can hook it to e.g. deprecate it, add a description,
                // add more args, etc?
                isMyCompanySpecialField: true,
              },
              {
                description: "Special field from MyCompany",
                type: build.graphql.GraphQLBoolean,
              },
            ),
          },
          "From DoThisInsteadPlugin",
        );
      },
    },
  },
};

declare global {
  namespace GraphileBuild {
    interface ScopeObjectFieldsField {
      /** Documentation for this scope goes here */
      isMyCompanySpecialField?: boolean;
    }
  }
}
```

Available on `GraphQLObjectType_fields`, `GraphQLInputObjectType_fields`, and
`GraphQLInterfaceType_fields`, this function registers scope for a field and
returns the generated field spec. If you do not call it, Graphile Build will
call it later on your behalf.

## Examples

### AddClientMutationIdDescriptionPlugin

```js
const AddClientMutationIdDescriptionPlugin = {
  name: "AddClientMutationIdDescriptionPlugin",
  description: "Adds description to all clientMutationId mutation inputs",
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
