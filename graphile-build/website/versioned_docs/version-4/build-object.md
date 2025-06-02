---
title: Build Object
---

# The Build Object

The build object contains a number of helpers and sources of information
relevant to the current build of the GraphQL API. If you're in watch mode then
every time a new schema is generated a new build object will be used.

The following properties/methods are available on the initial build object (more
may be added by plugins via the `build` hook):

### `newWithHooks(type, spec, scope)`

The bread-and-butter of Graphile Engine, this method is how we build hooked
GraphQL objects:

```js
const MyType = newWithHooks(type, spec, scope);
```

- `type` is a GraphQL object type, such as `GraphQLEnumType` or
  `GraphQLInputObjectType`
- `spec` is a valid specification that will be passed through the relevant hooks
  before ultimately being passed to the constructor of the aforementioned `type`
  and returning an instance of that type
- `scope` is where you can add scope information that will be available through
  the `scope` property in the context object passed to hooks (see `Context`
  below)

### `extend(input, extensions)`

Returns a new object by merging the properties of `input` and `extensions`
**without overwriting**. If any clashes occur an error will be throw. It is
advisable to use this instead of `Object.assign` or `{...input, ...extensions}`
because it will warn you if you're accidentally overwriting something.

### `graphql`

Equivalent to `require('graphql')`, by using this property you don't have to
import graphql and you're less likely to get version conflicts which are hard to
diagnose and resolve. Use of this property over importing `graphql` yourself is
highly recommended.

### `getTypeByName(typeName)`

Returns the GraphQL type associated with the given name, if it is known to the
current build, or `null` otherwise. Objects built with `newWithHooks` are
automatically registered, but external objects must be registered via:

### `addType(type: GraphQLNamedType)`

Registers an external (un-hooked) GraphQL type with the system so that it may be
referenced via `getTypeByName()`

### `getAliasFromResolveInfo(resolveInfo)`

Use this in your resolver to quickly retrieve the alias that this field was
requested as.

From
[`graphql-parse-resolve-info`](https://github.com/graphile/graphile-engine/tree/master/packages/graphql-parse-resolve-info#getaliasfromresolveinforesolveinfo)

<!-- TODO: example -->

### `resolveAlias`

Can be used in place of the `resolve` method for a field if you wish it to
resolve to the alias the field was requested as (as opposed to its name).

```js
resolveAlias(data, _args, _context, resolveInfo) {
  const alias = getAliasFromResolveInfo(resolveInfo);
  return data[alias];
}
```
