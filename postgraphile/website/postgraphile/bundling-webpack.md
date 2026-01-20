---
title: Bundling with Webpack
---

# Bundling PostGraphile with Webpack

PostGraphile is designed to be run as a standard Node.js application on the
server, using the built in `require` functionality which reads code from the
filesystem. However, if system startup time is a critical metric in your
environment (for example on serverless environments) this "searching and loading
from disk" behaviour can be **very** expensive. One way to solve this problem is
to bundle your code up into a single JavaScript file so that no filesystem
access is required.

Assuming your plugins all support it, rather than bundling up `postgraphile`
itself, we recommend [exporting your schema as executable
code](./exporting-schema.md) using `graphile-export` and then bundling the
resulting schema file for production usage. This will typically result in a
smaller bundle and faster startup times. (If it doesn't, your schema might want
some pruning!)

Webpack is a tool that you can use to bundle JavaScript code up; here’s an
example webpack configuration you might use:

```js title="webpack.config.js"
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  // The result of exporting your schema
  entry: "./exported-schema.mjs",
  output: {
    path: path.resolve(__dirname),
    // Where to save the resulting packed JS file
    filename: "exported-schema.webpacked.js",
    library: {
      type: "commonjs",
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      // For efficiency, enable production environment
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
          // Without this, some bugs may occur
          keep_classnames: true,
        },
      }),
    ],
  },
};
```

Install webpack with `yarn add --dev webpack webpack-cli` and then you can run
it as `yarn webpack`.

A more invasive and optimized config can be found in our
[Lambda example](https://github.com/graphile/postgraphile-lambda-example);
though it has not yet been updated for V5 - please do submit a PR!
