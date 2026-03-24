---
title: Hooks
sidebar_position: 3
---

The most common thing for a plugin to do is to register schema hooks.

The GraphQL hooks allow you to manipulate the argument (specification) that is
being passed to the GraphQL object constructors before the objects are
constructed. You can think of hooks as wrappers around the original object
spec, like this:

```js
const MyType = newWithHooks(GraphQLObjectType, spec);

// is equivalent to:

const MyType = new GraphQLObjectType(hook3(hook2(hook1(spec))));
```

Plugins declare which hooks they'd like to register as seen in
[the plugin documentation](./plugins).

Every hook callback function must synchronously return a value: either the
value that it was passed as the first argument or a derivative of it. We
prefer mutating the input object for performance reasons.

Hook functions for a given hook name run by default in the order they were
registered, which is why plugin order is sometimes relevant. Plugin authors
are encouraged to use `graphile-config` features to declare `before`/`after`
relationships for either their plugins or the individual hooks.

## Stages of the build process

The `hookName` that you register the function for must match
[one of the supported hooks](./all-hooks).

The general flow is:

1. A new [Build object](./build-object) with the basic functionality is created.
2. The `build` hook allows plugins to add new utility methods to the `build`
   object or overwrite previously declared ones.
3. A `Behavior` instance is added to the Build object, and behaviours for all
   the relevant entities are registered.
4. The build object is frozen to prevent further modification.
5. The `init` hook acts as the setup phase where all possible types are
   registered via `build.registerObjectType`, `build.registerUnionType`, etc
6. The schema is constructed internally using `newWithHooks(GraphQLSchema, …)`.
   This runs the `GraphQLSchema` and `GraphQLSchema_types` hooks and then
   triggers the type, field, argument, and value hooks as needed.
7. The `finalize` hook allows plugins to replace the schema that has been built
   with an alternative (likely derivative) schema, or to observe the schema
   before it is returned. It's generally only used for assertions - to ensure
   all inputs were handled, for example.

This hook system makes the library both powerful and flexible, at the expense
of traceability. Instead of having a clear declarative `import`, the origin of a
called method might be in any of the used plugins, or even multiple ones. See
[PostGraphile's debugging instructions][postgraphile-debugging] for how to
alleviate this.

## Deferred hooks

Hooks that are related to a position where GraphQL accepts a "thunk" are
deferred: GraphQL will call the thunk when it needs the relevant entities, which
may still be in the same tick; this allows for circular references between types
via their fields. These hooks receive `context.Self` to identify the type
instance that has already been created.

## Hook arguments

Hook callback functions are called with three arguments:

1. The [specification](./all-hooks.mdx#specification) to be modified (e.g.
   the object that would be passed to the `GraphQLObjectType` constructor, or
   the list to be returned for the object type's `interfaces`).
2. The `Build` object (see below).
3. The `Context` object related to that hook (see below); always contains a
   `scope` property.

### Build object (`Build`)

The [Build Object](./build-object) contains helpers and sources of information
relevant to the current build of the GraphQL API. If you're in watch mode then
every time a new schema is generated a new build object will be used.

Plugins may extend the `build` object via the `build` hook. Once the `build`
hook is complete the build object is frozen.

The most commonly used methods are:

- `build.extend(obj1, obj2, reason)` - performs a non-destructive merge of
  `obj2` into `obj2` (will not overwrite keys) and returns obj1; normally used
  as the return value for an object hook.
- `build.append(array1, array2, key, reason)` - pushes all the entries of array2
  onto array1, using key to identify and reject duplicates; normally used as the
  return value for a list hook.
- `build.inflection` - carries all the inflector functions for names.
- `build.graphql` - equivalent to `require('graphql')`, but helps ensure
  GraphQL version clashes do not occur.
- `build.grafast` - equivalent to `require('grafast')`, but helps ensure
  GraphQL version clashes do not occur.

See [Build Object](./build-object) for more.

### Context object (`Context`)

The [Context Object](./context-object) contains the information relevant to the
current hook. Most importantly it contains the `scope` (see
[Scope](./context-object#scope)), but it also contains a number of other useful
things.

Commonly used properties include:

- `scope` - an object detailing why an object exists, helping to classify it so
  that other hooks may easily detect it; for deeper hooks (such as
  `GraphQLObjectType_fields_field`) the scope from shallower hooks (such as
  `GraphQLObjectType`) are merged in.
- `Self` - only available on deferred hooks (those that are called after the
  entity is created, e.g. `GraphQLObjectType_fields`); this is the object that
  has been created, allowing recursive references.
- `fieldWithHooks(scope, spec)` - on `GraphQLObjectType_fields`,
  `GraphQLInputObjectType_fields`, and `GraphQLInterfaceType_fields`, used for
  adding a field if you need access to field helpers (or want to define a
  scope).

### Namespaces

Properties added to the `Build` object or set on the `Context.scope` should be
namespaced so that they do not conflict; for example PostGraphile uses the `pg`
namespace: `pgSql`, `pgIntrospection`, `isPgTableType`, etc. Third party plugins
should use different namespaces to avoid conflicts with core plugins.

[postgraphile-debugging]: https://postgraphile.org/postgraphile/current/debugging/#debug-envvars
