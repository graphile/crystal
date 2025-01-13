---
layout: page
path: /graphile-build/hooks/
title: Hooks
---

The most common thing for a plugin to do is to add hooks to the builder.

The GraphQL hooks ran by
[`newWithHooks`](/graphile-build/build-object/#newwithhookstype-spec-scope)
allow you to manipulate the argument (specification) that is being passed to the
GraphQL object constructors before the objects are constructed. You can think of
hooks as wrappers around the original object spec, like this:

```js
const MyType = newWithHooks(GraphQLObjectType, spec);

// is equivalent to:

const MyType = new GraphQLObjectType(hook3(hook2(hook1(spec))));
```

Hooks are registered via a call to
[`builder.hook(hookName, hookFunction)`](/graphile-build/schema-builder/#hookhookname-hookfunction).

Every `hookFunction` must synchronously return a value - either the value that
it was passed in as the first argument or a derivative of it (preferably
immutable, but we're not strict on that).

Hook functions for one hook by default run in the order they were registered,
that is why the order of plugins is sometimes relevant.

### Stages of the build process

The `hookName` that you register the function for must match
[one of the supported hooks](/graphile-build/all-hooks/).

Here's a brief rundown of how the hooks are used by the Graphile engine. See the
[`buildSchema`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/SchemaBuilder.js#L474-L499)
and
[`createBuild`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/SchemaBuilder.js#L450-L472)
methods in the source code.

1.  A new [Build object](/graphile-build/build-object/) with the basic
    functionality is created by
    [`makeNewBuild`](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/makeNewBuild.js#L230)
2.  The `inflection` hook allows plugins to add new inflection methods to the
    `build.inflection` object, or overwrite previously declared ones.
3.  The `build` hook allows plugins to add new utility methods to the `build`
    object itself, or overwrite previously declared ones.
4.  The `init` hook is the setup phase where the schema types get created by the
    plugins, using the
    [`newWithHooks`](/graphile-build/build-object/#newwithhookstype-spec-scope)
    (preferred) or
    [`addType`](/graphile-build/build-object/#addtypetype-graphqlnamedtype)
    (discouraged) methods of the build object. For example, the
    [default `StandardTypesPlugin`](/graphile-build/default-plugins/#standardtypesplugin)
    registers the builtin scalars, or the PostGraphile plugins register the
    types found in the introspection results.
5.  The schema is constructed using `newWithHooks(GraphQLSchema, …)`, where the
    `query`, `mutation` and `subscription` root operations are configured by the
    respective [default plugins](/graphile-build/default-plugins/) and
    [other schema options](https://github.com/graphql/graphql-js/blob/v14.5.6/src/type/schema.js#L318-L324)
    can be adjusted.
6.  The `finalize` hook allows plugins to replace the schema that has been built
    with an alternative (likely derivative) schema, should that be desired. It
    also opens an opportunity to do something with the built schema (for example
    log it out) before it is returned.

During the `init` hook, the
[hooks for the respective GraphQL types](/graphile-build/all-hooks/) are applied
[in the `newWithHooks` function](https://github.com/graphile/graphile-engine/blob/v4.4.4/packages/graphile-build/src/makeNewBuild.js#L329),
which may cause them to run in a nested fashion.

This hook system makes the library both powerful and flexible, at the expense of
traceability - instead of having a clear declarative `import`, the origin of a
called method might be in any of the used plugins, or even multiple ones. See
[PostGraphile's _Debugging_ instructions](/postgraphile/debugging/#debug-envvars)
for how to alleviate this.

### What to do when that hook fires: `hookFunction`

The `hookFunction` that you register via `builder.hook(hookName, hookFunction)`
will be called with 3 arguments:

1.  The input object (e.g. the spec that would be passed to the
    GraphQLObjectType constructor)
2.  The `Build` object (see below)
3.  The `Context` object (see below) which contains a `scope` property

#### Build object (`Build`)

The [Build Object](/graphile-build/build-object/) contains a number of helpers
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

See [Build Object](/graphile-build/build-object/) for the rest.

#### Context object (`Context`)

The [Context Object](/graphile-build/context-object/) contains the information
relevant to the current hook. Most importantly it contains the `scope` (an
object based on the third argument passed to `newWithHooks`) but it also
contains a number of other useful things. Here's some of the more commonly used
ones:

- `scope` - an object based on the third argument to `newWithHooks` or
  `fieldWithHooks`; for deeper hooks (such as `GraphQLObjectType:fields:field`)
  the scope from shallower hooks (such as `GraphQLObjectType`) are merged in.
- `Self` - only available on deferred hooks (those that are called after the
  object is created, e.g.`GraphQLObjectType:fields`) this is the object that has
  been created, allowing recursive references.
- `fieldWithHooks(fieldName, spec, scope = {})` - on `GraphQLObjectType:fields`,
  used for adding a field if you need access to the field helpers (or want to
  define a scope)

### Namespaces

Properties added to the `Build` object or set on the `Context.scope` should be
namespaced so that they do not conflict; for example `postgraphile` uses the
`pg` namespace: `pgSql`, `pgIntrospection`, `isPgTableType`, etc

<!-- TODO: expand -->
