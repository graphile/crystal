---
title: Bundling PostGraphile with webpack
---

In V5, we recommend that you export your schema with `graphile-export`
(assuming all your plugins support it, which they may not) and then bundle the
result. Here's an example webpack configuration you might use:

```js title="webpack.config.js"
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./exported-schema.mjs",
  output: {
    path: path.resolve(__dirname),
    filename: "exported-schema.webpacked.js",
    library: {
      type: "commonjs",
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.GRAPHILE_ENV": JSON.stringify("production"),
    }),
  ],
  target: "node", // use require() & use NodeJs CommonJS style
  externalsPresets: {
    node: true, // in order to ignore built-in modules like path, fs, etc.
  },
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
};
```

---

:::caution

This documentation is copied from Version 4 and has not been updated to Version
5 yet; it may not be valid.

:::

PostGraphile is designed to be ran as a standard Node.js application on the
server, using the built in `require` functionality which reads code from the
filesystem. However, if system startup time is a critical metric in your
environment (for example on serverless environments) this "searching and loading
from disk" behaviour can be **very** expensive. One way to solve this problem is
to bundle your code up into a single JavaScript file so that no filesystem
access is required.

Webpack is a tool that you can use to bundle JavaScript code up; there are,
however, many gotchas to doing so due to the way that a bundler works, and some
of these apply to PostGraphile:

- `__dirname` is less meaningful once the package is bundled, since `__dirname`
  in the bundle likely refers to a different location than `__dirname` did in
  the original code.
- Bundlers have particular problems with conditional `require(...)`s and with
  native modules. Unfortunately PostGraphile depends on modules that have both
  of these problems.

Worry not, for we can work around these issues with some configuration!

A minimal webpack config for PostGraphile (depending on what other resources you
use) might be this one from [@chadfurman](https://github.com/chadfurman):

```js
module.exports = {
  // All your other webpack options:
  // ...

  // We're targetting node:
  target: "node",

  // CUSTOMIZE THIS!
  context: `${__dirname}/app`,

  // Update `__dirname` references to point to the correct location, relative to
  // `context`:
  // https://webpack.js.org/configuration/node/#node__dirname
  node: {
    __dirname: true,
  },

  // We cannot bundle native modules, so leave it out:
  externals: ["pg-native"],
};
```

A more invasive and optimised config can be found in our
[Lambda example](https://github.com/graphile/postgraphile-lambda-example); note
that it cannot be used with watch mode and does not support subscriptions.
Here's a simplified and commented version of it:

```js
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  //...

  target: "node",
  plugins: [
    // Prevent loading pg-native (in a weird, backwards kind of way!)
    new webpack.DefinePlugin({
      // Nice light dependencies
      "process.env.NODE_ENV": '"production"',
      "process.env.POSTGRAPHILE_ENV": '"production"',

      // Forces node-postgres to attempt to use the native module, HOWEVER we
      // trick this below by replacing the native module with the JavaScript
      // client using `NormalModuleReplacementPlugin`. 😈
      "process.env.NODE_PG_FORCE_NATIVE": '"1"',

      // Set this if you want the smallest bundle; it excludes GraphiQL
      "process.env.POSTGRAPHILE_OMIT_ASSETS": '"1"',
    }),

    // Here's where we replace the native `pg` module reference with the
    // JavaScript client. (See NODE_PG_FORCE_NATIVE above.)
    new webpack.NormalModuleReplacementPlugin(
      /pg\/lib\/native\/index\.js$/,
      "../client.js",
    ),

    // Omit websocket functionality from postgraphile:
    new webpack.NormalModuleReplacementPlugin(
      /postgraphile\/build\/postgraphile\/http\/subscriptions\.js$/,
      `${__dirname}/src/postgraphile-http-subscriptions.js`,
    ),

    // Just in case you install express, omit the expensive view file:
    new webpack.NormalModuleReplacementPlugin(
      /express\/lib\/view\.js$/,
      `${__dirname}/src/express-lib-view.js`,
    ),
  ],

  // We don't need to use __dirname any more:
  node: {
    __dirname: false, // just output `__dirname`
  },

  // Without this, you may get errors such as `Error: GraphQL conflict for 'e'
  // detected! Multiple versions of graphql exist in your node_modules?`
  // May not be necessary for newer versions of the `graphql` module.
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false, // < This is the important part
        },
      }),
    ],
  },
};
```

Note this config depends on
[express-lib-view.js](https://raw.githubusercontent.com/graphile/postgraphile-lambda-example/master/src/express-lib-view.js)
and
[`postgraphile-http-subscriptions.js`](https://github.com/graphile/postgraphile-lambda-example/blob/master/src/postgraphile-http-subscriptions.js)

Install webpack with `yarn add --dev webpack webpack-cli` and then you can run
it as `yarn webpack`.
