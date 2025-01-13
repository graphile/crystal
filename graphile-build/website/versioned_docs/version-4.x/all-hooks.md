---
layout: page
path: /graphile-build/all-hooks/
title: All Hooks
---

The following hooks are currently supported, but more may be added in future.
Trying to add a hook for a hook name that does not exist will result in an
error.

[(See hooks in the source)](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/SchemaBuilder.js#L167-L230)

- `inflection`: The inflection object provides methods to derive names and will
  be part of the Build object, hook on the 'inflection' event to customize this
  object.

- `build`: The build object represents the current schema build and is passed to
  all hooks, hook the 'build' event to extend this object.

- `init`: The init event is triggered after `build` (which should not generate
  any GraphQL objects) and can be used to build common object types that may be
  useful later. The argument to this is an opaque object and should be passed
  through unmodified (it currently is an empty object that gets ignored).

- `GraphQLSchema`: This event defines the root-level schema configuration; hook
  it to add `query`, `mutation`, `subscription` root operations or similar
  options.

- `GraphQLObjectType*`: When creating a GraphQLObjectType via `newWithHooks`,
  we'll execute the following hooks:

  - `GraphQLObjectType` to add any root-level attributes, e.g. a description.
  - `GraphQLObjectType:interfaces` to add additional interfaces to this object
    type.
  - `GraphQLObjectType:fields` (_deferred_) to add additional fields to this
    object type. It is ran asynchronously (by passing `fields` as a thunk to
    [`GraphQLObjectType`](https://graphql.org/graphql-js/type/#graphqlobjecttype))
    and gets a reference to the final GraphQL Type as `Self` in the context.
  - `GraphQLObjectType:fields:field`: to manipulate any root-level attributes on
    an individual field, e.g. add a description.
  - `GraphQLObjectType:fields:field:args` to add arguments of an individual
    field.

- `GraphQLInputObjectType*`: When creating a GraphQLInputObjectType via
  `newWithHooks`, we'll execute the following hooks:

  - `GraphQLInputObjectType` to add any root-level attributes, e.g. a
    description.
  - `GraphQLInputObjectType:fields` (_deferred_) to add additional fields to
    this input type. It is ran asynchronously (by passing `fields` as a thunk to
    [`GraphQLInputObjectType`](https://graphql.org/graphql-js/type/#graphqlinputobjecttype))
    and gets a reference to the final GraphQL Type as `Self` in the context.
  - `GraphQLInputObjectType:fields:field`: to customize an individual field from
    above.

- `GraphQLEnumType*`: When creating a GraphQLEnumType via `newWithHooks`, we'll
  execute the following hooks:

  - `GraphQLEnumType` add any root-level attributes, e.g. add a description.
  - `GraphQLEnumType:values` add values.
  - `GraphQLEnumType:values:value` customize an individual value from above.

- `finalize`: This event is triggered when the schema has been constructed, hook
  it to modify or wrap the built schema instance.

The "(deferred)" hooks above (and their descendents) are not called until
_after_ the object is constructed (which means they can reference the object
itself - allowing circular references such as `type Query { query: Query }`);
GraphQL will automatically call them when `Type.getFields()` is called, which
may still be within the same tick - i.e. they are not fully asynchronous.

<!-- TODO: note about (discouraged) removing of options during a hook -->

### Input types

Depending on the hook being called the input object might be an array (as in the
case of `GraphQLObjectType:interfaces`) or an object (as in all other cases,
currently). More specifically, the types for each hook are:

- inflection - a plain object with some core inflection methods, built in
  [`makeNewBuild`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/makeNewBuild.js#L929-L997)
- build - a [`Build` object](/graphile-build/build-object/)
- init - an opaque object, please just return it verbatim

- GraphQLSchema -
  [`GraphQLSchemaConfig`](http://graphql.org/graphql-js/type/#graphqlschema)

- GraphQLObjectType -
  [`GraphQLObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType:interfaces -
  [array of `GraphQLInterfaceType` instances](http://graphql.org/graphql-js/type/#graphqlinterfacetype)
- GraphQLObjectType:fields -
  [`GraphQLFieldConfigMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType:fields:field -
  [`GraphQLFieldConfig`](http://graphql.org/graphql-js/type/#graphqlobjecttype)
- GraphQLObjectType:fields:field:args -
  [`GraphQLFieldConfigArgumentMap`](http://graphql.org/graphql-js/type/#graphqlobjecttype)

- GraphQLInputObjectType -
  [`GraphQLInputObjectTypeConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
- GraphQLInputObjectType:fields -
  [`GraphQLInputObjectConfigFieldMap`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)
- GraphQLInputObjectType:fields:field -
  [`GraphQLInputObjectFieldConfig`](http://graphql.org/graphql-js/type/#graphqlinputobjecttype)

- GraphQLEnumType -
  [`GraphQLEnumTypeConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)
- GraphQLEnumType:values -
  [`GraphQLEnumValueConfigMap`](http://graphql.org/graphql-js/type/#graphqlenumtype)
- GraphQLEnumType:values:value -
  [`GraphQLEnumValueConfig`](http://graphql.org/graphql-js/type/#graphqlenumtype)

- finalize -
  [`GraphQLSchema`](http://graphql.org/graphql-js/type/#graphqlschema)

<!-- TODO: document the scope of each hook -->
