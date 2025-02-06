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

Plugins declare which hooks they'd like to register as seen in [the plugin documentation](./plugins).

Every hook callback function must synchronously return a value - either the
value that it was passed in as the first argument or a derivative of it.
Generally we prefer the input object to be mutated for performance reasons.

Hook functions for a given hook name run by default in the order they were
registered, which is why the order of plugins is sometimes relevant, however
plugin authors are encouraged to use the `graphile-config` features to declare
the `before`/`after` for either their plugins or the individual hooks.

### Stages of the build process

The `hookName` that you register the function for must match
[one of the supported hooks](/graphile-build/all-hooks).

The general flow is:

1.  A new [Build object](/graphile-build/build-object) with the basic
    functionality is created
2.  The `build` hook allows plugins to add new utility methods to the `build`
    object itself, or overwrite previously declared ones.
3.  A `Behavior` instance is added to the Build object, and behaviors for all the relevant entities are registered.
4.  The build object is frozen to prevent further modification.
5.  The `init` hook acts as the setup phase where all possible types should be
    registered via `build.registerObjectType`, `build.registerUnionType`, etc.
6.  The schema is constructed internally using `newWithHooks(GraphQLSchema, …)`,
    where the `query`, `mutation` and `subscription` root operations are
    provided by the respective default plugins (e.g. `QueryPlugin`). This in
    turn triggers all the various hooks to be called in a recursive fashion as
    types, fields, arguments and so on are created.
7.  The `finalize` hook allows plugins to replace the schema that has been built
    with an alternative (likely derivative) schema, should that be desired. It
    also opens an opportunity to do something with the built schema (for example
    log it out) before it is returned.

This hook system makes the library both powerful and flexible, at the expense of
traceability - instead of having a clear declarative `import`, the origin of a
called method might be in any of the used plugins, or even multiple ones. See
[PostGraphile's _Debugging_ instructions](https://postgraphile.org/postgraphile/current/debugging/#debug-envvars)
for how to alleviate this.

Hook callback functions will be called with 3 arguments:

1.  The input object (e.g. the spec that would be passed to the
    GraphQLObjectType constructor)
2.  The `Build` object (see below)
3.  The `Context` object (see below) which contains a `scope` property

#### Build object (`Build`)

The [Build Object](/graphile-build/build-object) contains a number of helpers
and sources of information relevant to the current build of the GraphQL API. If
you're in watch mode then every time a new schema is generated a new build
object will be used.

Plugins may extend the `build` object via the `build` hook. Once the `build`
hook is complete the build object is frozen.

The most commonly used methods are:

- `build.extend(obj1, obj2)` - returns a new object based on a non-destructive
  merge of `obj1` and `obj2` (will not overwrite keys!) - normally used at the
  return value for a hook
- `build.graphql` - equivalent to `require('graphql')`, but helps ensure GraphQL
  version clashes do not occur
- `build.inflection` - carries all the inflector functions for names

See [Build Object](/graphile-build/build-object) for more.

#### Context object (`Context`)

The [Context Object](/graphile-build/context-object) contains the information
relevant to the current hook. Most importantly it contains the `scope` (an
object based on the third argument passed to `newWithHooks`) but it also
contains a number of other useful things. Here's some of the more commonly used
ones:

- `scope` - an object based on the third argument to `newWithHooks` or
  `fieldWithHooks`; for deeper hooks (such as `GraphQLObjectType_fields_field`)
  the scope from shallower hooks (such as `GraphQLObjectType`) are merged in.
- `Self` - only available on deferred hooks (those that are called after the
  object is created, e.g.`GraphQLObjectType:fields`) this is the object that has
  been created, allowing recursive references.
- `fieldWithHooks(scope, spec)` - on `GraphQLObjectType_fields`, used for
  adding a field if you need access to the field helpers (or want to define a
  scope)

### Namespaces

Properties added to the `Build` object or set on the `Context.scope` should be
namespaced so that they do not conflict; for example `postgraphile` uses the
`pg` namespace: `pgSql`, `pgIntrospection`, `isPgTableType`, etc

<!-- TODO: expand -->
