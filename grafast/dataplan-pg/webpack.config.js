const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");

module.exports = {
  entry: {
    index: "./dist/index.js",
    "adaptors/pg": "./dist/adaptors/pg.js",
  },
  output: {
    path: path.resolve(__dirname, "release/dist"),
    filename: "[name].js",
    library: {
      name: "dataplan_pg",
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
  target: "node", // use require() & use NodeJs CommonJS style
  externalsPresets: {
    node: true, // in order to ignore built-in modules like path, fs, etc.
  },
  externals: [
    // in order to ignore all modules in node_modules folder
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../node_modules"),
    }),
  ],
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
