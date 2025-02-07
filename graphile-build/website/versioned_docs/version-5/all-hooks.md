---
layout: page
path: /graphile-build/all-hooks/
title: All Hooks
sidebar_position: 4
---

The following hooks are currently supported, but more may be added in future.
Trying to add a hook for a hook name that does not exist will result in an
error.

- `build`: The build object represents the current schema build and is passed
  to all hooks, hook the 'build' event to extend this object. GraphQL types
  should not be constructed during this phase.

- `init`: The init event is triggered after `build` and should be used to
  register the GraphQL type names and their specifications for types that may be
  useful later. The argument to this is an opaque object and should be passed
  through unmodified (it currently is an empty object that gets ignored).

- `GraphQLSchema`: This event defines the root-level schema configuration; hook
  it to add `query`, `mutation`, `subscription` root operations or similar
  options.

- `GraphQLObjectType*`: When creating a GraphQLObjectType,
  we'll execute the following hooks:

  - `GraphQLObjectType` to add any root-level attributes, e.g. a description.
  - `GraphQLObjectType_interfaces` to add additional interfaces to this object
    type.
  - `GraphQLObjectType_fields` (_deferred_) to add additional fields to this
    object type. It is ran asynchronously (by passing `fields` as a thunk to
    [`GraphQLObjectType`](https://graphql.org/graphql-js/type/#graphqlobjecttype))
    and gets a reference to the final GraphQL Type as `Self` in the context.
  - `GraphQLObjectType_fields_field`: to manipulate any root-level attributes on
    an individual field, e.g. add a description.
  - `GraphQLObjectType_fields_field_args` to add arguments of an individual
    field.
  - `GraphQLObjectType_fields_field_args_arg` to modify a specific argument.

- `GraphQLInputObjectType*`: When creating a GraphQLInputObjectType, we'll execute the following hooks:

  - `GraphQLInputObjectType` to add any root-level attributes, e.g. a
    description.
  - `GraphQLInputObjectType_fields` (_deferred_) to add additional fields to
    this input type. It is ran asynchronously (by passing `fields` as a thunk to
    [`GraphQLInputObjectType`](https://graphql.org/graphql-js/type/#graphqlinputobjecttype))
    and gets a reference to the final GraphQL Type as `Self` in the context.
  - `GraphQLInputObjectType_fields_field`: to customize an individual field from
    above.

- `GraphQLEnumType*`: When creating a GraphQLEnumType, we'll
  execute the following hooks:

  - `GraphQLEnumType` add any root-level attributes, e.g. add a description.
  - `GraphQLEnumType_values` add values.
  - `GraphQLEnumType_values_value` customize an individual value from above.

- `finalize`: This event is triggered when the schema has been constructed, hook
  it to modify or wrap the built schema instance.

:::info

This documentation does NOT contains all the hooks.

<!-- TODO: list them all! -->

:::

The "(deferred)" hooks above (and their descendents) are not called until
_after_ the object is constructed (which means they can reference the object
itself - allowing circular references such as `type Query { query: Query }`);
GraphQL will automatically call them when `Type.getFields()` is called, which
may still be within the same tick - i.e. they are not necessarily fully
asynchronous.

<!-- TODO: note about (discouraged) removing of options during a hook -->

### Input types

Depending on the hook being called the input object might be an array (as in the
case of `GraphQLObjectType_interfaces`) or an object (as in all other cases,
currently). More specifically, the types for each hook are:

- inflection - a plain object with some core inflection methods, built in
  [`makeNewBuild`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/makeNewBuild.js#L929-L997)
- build - a [`Build` object](./build-object)
- init - an opaque object, please just return it verbatim

- GraphQLSchema -
  [`GraphQLSchemaConfig`](http://graphql.org/graphql-js/type/#graphqlschema)

- GraphQLObjectType -
  [`GraphQLObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType_interfaces -
  [array of `GraphQLInterfaceType` instances](http://graphql.org/graphql-js/type/#graphqlinterfacetype)
- GraphQLObjectType_fields -
  [`GraphQLFieldConfigMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType_fields_field -
  [`GraphQLFieldConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType_fields_field_args -
  [`GraphQLFieldConfigArgumentMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)

- GraphQLInputObjectType -
  [`GraphQLInputObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
- GraphQLInputObjectType_fields -
  [`GraphQLInputObjectConfigFieldMap`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
- GraphQLInputObjectType_fields_field -
  [`GraphQLInputObjectFieldConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)

- GraphQLEnumType -
  [`GraphQLEnumTypeConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)
- GraphQLEnumType_values -
  [`GraphQLEnumValueConfigMap`](http://graphql.org/graphql-js/type/#graphqlenumtype)
- GraphQLEnumType_values_value -
  [`GraphQLEnumValueConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)

- finalize -
  [`GraphQLSchema`](http://graphql.org/graphql-js/type/#graphqlschema)

<!-- TODO: document the scope of each hook -->
