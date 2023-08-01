const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");

module.exports = {
  devtool: false,
  entry: {
    index: "./dist/index.js",
    envelop: {
      dependOn: "index",
      import: "./dist/envelop.js",
    },
  },
  output: {
    path: path.resolve(__dirname, "release/dist"),
    filename: "[name].js",
    library: {
      name: "grafast",
      type: "umd",
    },
    globalObject: "this",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.GRAPHILE_ENV": JSON.stringify("production"),
    }),
    new LicenseCheckerWebpackPlugin({
      allow: "(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT OR 0BSD)",
      ignore: [
        "@graphile/*",
        "@graphile-contrib/*",
        "@grafast/*",
        "@dataplan/*",
        "@localrepo/*",
        "graphile-config",
      ],
      emitError: true,
      outputFilename: "LICENSES.txt",
      // Fix issue with scoped npm modules
      filter:
        /(^.*[/\\]node_modules[/\\]((?:@[^/\\]+[/\\])?(?:[^@/\\][^/\\]*)))/,
    }),
  ],
  externals: {
    // graphql -> external
    graphql: {
      commonjs: "graphql",
      commonjs2: "graphql",
      amd: "graphql",
      root: "graphql",
    },
    // TODO: we really need to remove the dependency on buildExecutionContext
    "graphql/execution/execute": {
      commonjs: "graphql/execution/execute",
      commonjs2: "graphql/execution/execute",
      amd: "graphql/execution/execute",
      root: "graphql/execution/execute",
    },
    // crypto.createHash -> external, optional
    crypto: {
      commonjs: "crypto",
      commonjs2: "crypto",
      amd: "crypto",
      root: "crypto",
    },
    // util.inspect -> external, optional
    util: {
      commonjs: "util",
      commonjs2: "util",
      amd: "util",
      root: "util",
    },
    // @graphile/lru -> bundle
    // chalk -> bundle
    // debug -> bundle
    // events.EventEmitter -> replaced with eventemitter3 -> bundle
    // iterall -> bundle
    // lodash -> bundle
    // tslib -> bundle
  },
  performance: {
    maxEntrypointSize: 215000,
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
