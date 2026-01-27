---
layout: page
path: /graphile-build/all-hooks/
title: All Hooks
sidebar_position: 4
---

The following hooks are currently supported; attempting to register any other
hook name results in an error.

## Hook list

- `build`: Extend the `build` object. Do not construct GraphQL types here.
- `init`: Register types via `build.registerType` before the schema is built.
- `finalize`: Inspect, wrap, or replace the built schema.

- `GraphQLSchema`: Configure the schema root types and options.
- `GraphQLSchema_types`: Add named types that are not otherwise referenced
  (typically abstract types).

- `GraphQLObjectType`: Extend object type configuration.
- `GraphQLObjectType_interfaces`: Add interfaces to the object type.
- `GraphQLObjectType_fields` (deferred): Add fields to the object type.
- `GraphQLObjectType_fields_field`: Adjust a single field config.
- `GraphQLObjectType_fields_field_args`: Adjust a field argument map.
- `GraphQLObjectType_fields_field_args_arg`: Adjust a single argument config.

- `GraphQLInputObjectType`: Extend input object configuration.
- `GraphQLInputObjectType_fields` (deferred): Add fields to the input object.
- `GraphQLInputObjectType_fields_field`: Adjust a single input field config.

- `GraphQLEnumType`: Extend enum configuration.
- `GraphQLEnumType_values`: Add or adjust enum values.
- `GraphQLEnumType_values_value`: Adjust a single enum value config.

- `GraphQLUnionType`: Extend union configuration.
- `GraphQLUnionType_types`: Add types to the union.

- `GraphQLInterfaceType`: Extend interface configuration.
- `GraphQLInterfaceType_fields` (deferred): Add fields to the interface.
- `GraphQLInterfaceType_fields_field`: Adjust a single field config.
- `GraphQLInterfaceType_fields_field_args`: Adjust a field argument map.
- `GraphQLInterfaceType_fields_field_args_arg`: Adjust a single argument config.
- `GraphQLInterfaceType_interfaces`: Add interfaces to the interface.

- `GraphQLScalarType`: Extend scalar configuration.

The deferred hooks are called after the object is constructed (GraphQL uses a
thunk for the `fields` callback), which means they can reference the object
itself via `context.Self`. GraphQL calls the thunk when the fields are needed,
which can still be in the same tick.

## Input types

These are the input types passed as the first argument to each hook:

- `build` - `Build` (the current build object)
- `init` - `Record<string, never>` (an empty object)
- `finalize` - [`GraphQLSchema`][graphql-schema]

- `GraphQLSchema` - [`GraphQLSchemaConfig`][graphql-schema]
- `GraphQLSchema_types` - `GraphQLNamedType[]`

- `GraphQLObjectType` - `GraphileBuild.GrafastObjectTypeConfig`
- `GraphQLObjectType_interfaces` - [`GraphQLInterfaceType[]`][graphql-interface]
- `GraphQLObjectType_fields` - `GraphileBuild.GrafastFieldConfigMap`
- `GraphQLObjectType_fields_field` - `GraphileBuild.GrafastFieldConfig`
- `GraphQLObjectType_fields_field_args` -
  `GraphileBuild.GrafastFieldConfigArgumentMap`
- `GraphQLObjectType_fields_field_args_arg` -
  `GraphileBuild.GrafastArgumentConfig`

- `GraphQLInputObjectType` - `GraphileBuild.GrafastInputObjectTypeConfig`
- `GraphQLInputObjectType_fields` -
  [`GraphQLInputFieldConfigMap`][graphql-input]
- `GraphQLInputObjectType_fields_field` -
  `GraphileBuild.GrafastInputFieldConfig`

- `GraphQLEnumType` - [`GraphQLEnumTypeConfig`][graphql-enum]
- `GraphQLEnumType_values` - [`GraphQLEnumValueConfigMap`][graphql-enum]
- `GraphQLEnumType_values_value` - [`GraphQLEnumValueConfig`][graphql-enum]

- `GraphQLUnionType` - `GraphileBuild.GrafastUnionTypeConfig`
- `GraphQLUnionType_types` - [`GraphQLObjectType[]`][graphql-object]

- `GraphQLInterfaceType` - `GraphileBuild.GrafastInterfaceTypeConfig`
- `GraphQLInterfaceType_fields` - [`GraphQLFieldConfigMap`][graphql-object]
- `GraphQLInterfaceType_fields_field` - [`GraphQLFieldConfig`][graphql-object]
- `GraphQLInterfaceType_fields_field_args` -
  [`GraphQLFieldConfigArgumentMap`][graphql-object]
- `GraphQLInterfaceType_fields_field_args_arg` -
  [`GraphQLArgumentConfig`][graphql-object]
- `GraphQLInterfaceType_interfaces` -
  [`GraphQLInterfaceType[]`][graphql-interface]

- `GraphQLScalarType` - [`GraphQLScalarTypeConfig`][graphql-scalar]

[graphql-schema]: https://graphql.org/graphql-js/type/#graphqlschema
[graphql-interface]: https://graphql.org/graphql-js/type/#graphqlinterfacetype
[graphql-input]: https://graphql.org/graphql-js/type/#graphqlinputobjecttype
[graphql-enum]: https://graphql.org/graphql-js/type/#graphqlenumtype
[graphql-object]: https://graphql.org/graphql-js/type/#graphqlobjecttype
[graphql-scalar]: https://graphql.org/graphql-js/type/#graphqlscalartype
