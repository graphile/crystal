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
  externals: {
    // graphql -> external
    graphql: {
      commonjs: "graphql",
      commonjs2: "graphql",
      amd: "graphql",
      root: "graphql",
    },
    // grafast -> external
    grafast: {
      commonjs: "grafast",
      commonjs2: "grafast",
      amd: "grafast",
      root: "grafast",
    },
    // @dataplan/json -> external
    "@dataplan/json": {
      commonjs: "@dataplan/json",
      commonjs2: "@dataplan/json",
      amd: "@dataplan/json",
      root: "@dataplan/json",
    },
    // pg -> external
    pg: {
      commonjs: "pg",
      commonjs2: "pg",
      amd: "pg",
      root: "pg",
    },
    // postgres-array -> external
    "postgres-array": {
      commonjs: "postgres-array",
      commonjs2: "postgres-array",
      amd: "postgres-array",
      root: "postgres-array",
    },
    // postgres-range -> external
    "postgres-range": {
      commonjs: "postgres-range",
      commonjs2: "postgres-range",
      amd: "postgres-range",
      root: "postgres-range",
    },
    // pg-sql2 -> external
    "pg-sql2": {
      commonjs: "pg-sql2",
      commonjs2: "pg-sql2",
      amd: "pg-sql2",
      root: "pg-sql2",
    },
    // crypto.createHash -> external
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
    // tslib -> bundle
  },
  performance: {
    maxEntrypointSize: 215000,
  },
};
