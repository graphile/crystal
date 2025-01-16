---
title: Schema Plugins
---

# GraphQL Schema Plugins

PostGraphile's schema generator is built from a number of
[Graphile Engine plugins](https://build.graphile.org/graphile-build/plugins/). You can
write your own plugins - either using the helpers available in `graphile-utils`,
or using the raw plugin interface available from Graphile Engine.

_If you're looking for an easy way to remove/rename things, check out
[smart comments](./smart-comments)._

### Writing Plugins

We've created a number of plugin helpers for common tasks:

- To add new fields and types,
  [check out `makeExtendSchemaPlugin`](./make-extend-schema-plugin)
- To change how fields and types are automatically named,
  [check out `makeAddInflectorsPlugin`](./make-add-inflectors-plugin)
- To change how fields are resolved,
  [check out `makeWrapResolversPlugin`](./make-wrap-resolvers-plugin)
- To make certain fields nullable or non-nullable,
  [check out `makeChangeNullabilityPlugin`](./make-change-nullability-plugin)
- To process the generated schema, for example to run it through a third-party
  tool such as `graphql-shield`,
  [check out `makeProcessSchemaPlugin`](./make-process-schema-plugin)

For everything else, you can
[write raw Graphile Engine plugins](./extending-raw).

Do check out our [plugin gallery](./plugin-gallery) for examples of plugins.
These are generally suitable for copying/pasting into your app and then
customising to your needs.

### Loading Plugins

Once you've written (or installed) a schema plugin, you can load it using the
CLI:

```bash
# For a local file:
postgraphile \
  --append-plugins `pwd`/add-http-bin-plugin.js \
  -c postgres:///mydb

# Or, for an npm plugin:
postgraphile \
  --append-plugins postgraphile-plugin-connection-filter \
  -c postgres:///mydb
```

The `--append-plugins` option accepts a comma separated list of module specs. A
module spec is the absolute path to a JS file to load (or name of an npm
module), optionally followed by a colon and the name of the export (you must
omit this if the function is exported via
`module.exports = function MyPlugin(...){...}`). E.g.

- `--append-plugins my-npm-module` (requires
  `module.exports = function NpmPlugin(...) {...}`)
- `--append-plugins /path/to/local/module.js:MyPlugin` (requires
  `exports.MyPlugin = function MyPlugin(...) {...}`)

If you're using postgraphile as a library you can instead use the
`appendPlugins` option which you should pass an array of plugin functions (you
are responsible for importing these functions yourself).

```js
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
//...
app.use(
  postgraphile(process.env.DATABASE_URL, "app_public", {
    appendPlugins: [
      ConnectionFilterPlugin,
      /* add any more plugins you need here */
    ],
    graphiql: true,
  }),
);
//...
```

Remember: multiple versions of `graphql` in your `node_modules` will cause
problems; so we **strongly** recommend using the `graphql` object that's
available on the `Build` object (second argument to hooks) rather than requiring
your own version.
