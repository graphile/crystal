---
layout: page
path: /graphile-build/build-object/
title: The Build Object
sidebar_position: 6
---

The build object contains a number of helpers and sources of information
relevant to the current build of the GraphQL API. If you're in watch mode then
every time a new schema is generated a new build object will be used.

The following properties/methods are available on the initial build object (more
may be added by plugins via the `build` hook):

## `registerObjectType(typeName, scope, specGenerator, origin)`

The bread-and-butter of Graphile Engine, this method is how we register hooked
GraphQL objects:

```js
build.registerObjectType(
  "MyType",
  { isMyType: true },
  () => {
    return {
      fields: {
        meaningOfLife: {
          type: graphql.GraphQLInt,
          plan() {
            return constant(42);
          },
        },
      },
    };
  },
  "MyType from MyPlugin",
);
```

- `type` is a GraphQL object type, such as `GraphQLEnumType` or
  `GraphQLInputObjectType`
- `spec` is a valid specification that will be passed through the relevant hooks
  before ultimately being passed to the constructor of the aforementioned `type`
  and returning an instance of that type
- `scope` is where you can add scope information that will be available through
  the `scope` property in the context object passed to hooks (see `Context`
  below)

## `getTypeByName(typeName)`

The counterpart to `register*Type`, this is how we retrieve or build the GraphQL
types that we registered previously.

```js
const MyType = build.getTypeByName("MyType");
```

## `extend(input, extensions, origin)`

Returns the input object with `extensions` merged in **without overwriting**.
If any clashes occur an error will be throw. It is advisable to use this
instead of `Object.assign` or `{...input, ...extensions}` because it will warn
you if you're accidentally overwriting something. The origin helps users to
deal with clashes by determining what this call related to.

## `graphql`

Equivalent to `require('graphql')`, by using this property you don't have to
import graphql and you're less likely to get version conflicts which are hard to
diagnose and resolve. Use of this property over importing `graphql` yourself is
highly recommended.
