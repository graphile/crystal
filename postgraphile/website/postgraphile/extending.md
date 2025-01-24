---
title: GraphQL Schema Plugins
---

PostGraphile's schema generator is built from a number of
[graphile-build plugins](https://build.graphile.org/graphile-build/plugins/). You can
write your own plugins — either using the helpers available in `graphile-utils`,
or using the raw plugin interface available from Graphile Build.

_If you're looking for an easy way to remove/rename things, check out
[smart tags](./smart-tags)._

### Inflection example

Here's an example of a simple plugin which uses the ["inflection"
system](./inflection) to rename all database columns named `full_name` to be
output as `name` in GraphQL:

```js
/** @type {GraphileConfig.Plugin} */
const FullNameToNamePlugin = {
  name: "FullNameToNamePlugin",
  inflection: {
    replace: {
      attribute(previous, options, details) {
        if (details.attributeName === "full_name") {
          return "name";
        } else {
          return previous?.(details) ?? details.attributeName;
        }
      },
    },
  },
};
```

### Writing Plugins

We've created a number of plugin helpers for common tasks:

- To add new fields and types,
  [check out `makeExtendSchemaPlugin`](./make-extend-schema-plugin)
- To change how fields and types are automatically named,
  [check out "Overriding inflection"](./inflection#overriding-inflection)
- To change how fields are planned,
  [check out `makeWrapPlansPlugin`](./make-wrap-plans-plugin)
- To make certain fields nullable or non-nullable,
  [check out `makeChangeNullabilityPlugin`](./make-change-nullability-plugin)
- To process the generated schema,
  [check out `makeProcessSchemaPlugin`](./make-process-schema-plugin)

For everything else, you can
[write raw Graphile Build plugins](./extending-raw).

Do check out our [plugin gallery](./plugin-gallery) for examples of plugins.
These are generally suitable for copying/pasting into your app and then
customising to your needs.

### Loading Plugins

Once you've written (or installed) a plugin, you can load it via your preset:

```js title="graphile.config.mjs"
import MyPlugin from "./myPlugin.mjs";

export default {
  // ...
  plugins: [MyPlugin],
};
```

Remember: multiple versions of `graphql` in your `node_modules` will cause
problems; so we **strongly** recommend using the `graphql` object that's
available on the `Build` object (second argument to hooks) rather than requiring
your own version.
