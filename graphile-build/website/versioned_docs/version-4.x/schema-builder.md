---
layout: page
path: /graphile-build/schema-builder/
title: SchemaBuilder instance
---

The SchemaBuilder instance returned by
[`getBuilder`](/graphile-build/graphile-build/) has a number of methods on it
that may be of interest:

### Consumer methods

Use these methods when you wish to consume a GraphQL schema

#### `watchSchema(listener)`

Returns a promise which resolves after the first schema has been generated and
passed to the `listener` callback. Any further schemas that are generated will
be passed to the `listener` callback immediately.

#### `unwatchSchema()`

The reverse of `watchSchema`, this returns a promise that will be resolved when
a schema is successfully unwatched. After it resolves no further calls will be
made to `listener`.

#### `buildSchema()`

This synchronous function returns a (possibly cached) up-to-date
`GraphQLSchema`, you can think of it as:

```js
class SchemaBuilder {
  // ...
  buildSchema() {
    const build = this.createBuild();
    return build.newWithHooks(GraphQLSchema, {}, { isSchema: true });
  }
}
```

#### `createBuild()`

This synchronous function returns a fresh
[`Build` object](/graphile-build/build-object/) which you can use to build other
objects (such as the `GraphQLSchema` created above). Be aware the the build will
store created objects, so it is not safe to use the same `build` object to
create a GraphQL object with the same name multiple times - each time should use
a fresh build object.

### Plugin methods

Use these methods from plugins.

#### `hook(hookName, hookFunction)`

Example: this hook will log the name of each GraphQLObjectType that is built:

```js
function GraphQLObjectTypeLogNamePlugin(builder) {
  builder.hook("GraphQLObjectType", spec => {
    console.log(
      "A new GraphQLObjectType is being constructed with name: ",
      spec.name
    );
  });
}
```

See [Hooks](/graphile-build/hooks/) for details

#### `registerWatcher(watcher, unwatcher)`

Registers two functions: one to be called if/when schema watching begins (see
`watchSchema` above), and another to be called if/when schema watching ends (to
clean up). Each function is passed one argument: the function to call when a
change occurs.

TODO: document further (ref:
https://github.com/graphile/graphile-engine/blob/83ee6948c5ab9f202773bf7518ea4d2cca3ec349/packages/graphile-build/__tests__/watch.test.js#L28-L35)

```js
builder.registerWatcher(
  triggerRebuild => {
    eventEmitter.on("change", triggerRebuild);
  },
  triggerRebuild => {
    eventEmitter.removeListener("change", triggerRebuild);
  }
);
```
