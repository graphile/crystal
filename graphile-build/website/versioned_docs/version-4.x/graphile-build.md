---
layout: page
path: /graphile-build/graphile-build/
title: The graphile-build module
---

We export two methods, both of which take the same arguments:

- `plugins` - an array of [plugin functions](/graphile-build/plugins/) to
  execute
- `options` - an optional hash of [options](/graphile-build/plugin-options/) to
  pass through to all the plugins

We also export one property: `defaultPlugins`

### `defaultPlugins`

An array of the built-in plugins, see
[Default Plugins](/graphile-build/default-plugins/) for more info.

### `buildSchema(plugins, options)`

Returns a promise which resolves to a GraphQL schema generated from the list of
plugins provided.

```js{5}
const { buildSchema, defaultPlugins } = require("graphile-build");
const { printSchema } = require("graphql/utilities");

async function main() {
  const schema = await buildSchema(defaultPlugins);
  console.log(printSchema(schema));
}

main();
```

### `getBuilder(plugins, options)`

Loads all the plugins and returns an instance of `SchemaBuilder`. This is useful
if you want to use watch mode; see
[`SchemaBuilder`](/graphile-build/schema-builder/) for more information.

```js{4,8}
const { getBuilder, defaultPlugins } = require("graphile-build");

async function main() {
  const builder = await getBuilder(defaultPlugins, {});
  function onSchema(schema) {
    console.log(printSchema(schema));
  }
  await builder.watchSchema(onSchema);
}

main();
```
