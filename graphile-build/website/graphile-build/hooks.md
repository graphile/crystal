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

Every hook callback function must synchronously return a value, either the
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
   registered via `build.registerType`.
6. The schema is constructed internally using `newWithHooks(GraphQLSchema, …)`.
   This runs the `GraphQLSchema` and `GraphQLSchema_types` hooks and then
   triggers the type, field, argument, and value hooks as needed.
7. The `finalize` hook allows plugins to replace the schema that has been built
   with an alternative (likely derivative) schema, or to observe the schema
   before it is returned.

This hook system makes the library both powerful and flexible, at the expense
of traceability. Instead of having a clear declarative `import`, the origin of a
called method might be in any of the used plugins, or even multiple ones. See
[PostGraphile's debugging instructions][postgraphile-debugging] for how to
alleviate this.

## Deferred hooks

The `*_fields` hooks are deferred: GraphQL will call the `fields` thunk when it
needs the fields, which can still be in the same tick. These hooks therefore
receive `context.Self`, allowing circular references.

## Hook arguments

Hook callback functions are called with three arguments:

1. The input object (e.g. the spec that would be passed to the
   `GraphQLObjectType` constructor).
2. The `Build` object (see below).
3. The `Context` object (see below), which contains a `scope` property.

### Build object (`Build`)

The [Build Object](./build-object) contains helpers and sources of information
relevant to the current build of the GraphQL API. If you're in watch mode then
every time a new schema is generated a new build object will be used.

Plugins may extend the `build` object via the `build` hook. Once the `build`
hook is complete the build object is frozen.

The most commonly used methods are:

- `build.extend(obj1, obj2)` - returns a new object based on a non-destructive
  merge of `obj1` and `obj2` (will not overwrite keys); normally used as the
  return value for a hook.
- `build.graphql` - equivalent to `require('graphql')`, but helps ensure
  GraphQL version clashes do not occur.
- `build.inflection` - carries all the inflector functions for names.

See [Build Object](./build-object) for more.

### Context object (`Context`)

The [Context Object](./context-object) contains the information relevant to the
current hook. Most importantly it contains the `scope` (an object based on the
third argument passed to `newWithHooks`), but it also contains a number of other
useful things.

Commonly used properties include:

- `scope` - an object based on the third argument to `newWithHooks` or
  `fieldWithHooks`; for deeper hooks (such as `GraphQLObjectType_fields_field`)
  the scope from shallower hooks (such as `GraphQLObjectType`) are merged in.
- `Self` - only available on deferred hooks (those that are called after the
  object is created, e.g. `GraphQLObjectType_fields`); this is the object that
  has been created, allowing recursive references.
- `fieldWithHooks(scope, spec)` - on `GraphQLObjectType_fields`,
  `GraphQLInputObjectType_fields`, and `GraphQLInterfaceType_fields`, used for
  adding a field if you need access to field helpers (or want to define a
  scope).

### Namespaces

Properties added to the `Build` object or set on the `Context.scope` should be
namespaced so that they do not conflict; for example PostGraphile uses the `pg`
namespace: `pgSql`, `pgIntrospection`, `isPgTableType`, etc.

[postgraphile-debugging]: https://postgraphile.org/postgraphile/current/debugging/#debug-envvars
