const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    index: "./dist/index.js",
    "adaptors/node-postgres": {
      dependOn: "index",
      import: "./dist/adaptors/node-postgres.js",
    },
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
};
