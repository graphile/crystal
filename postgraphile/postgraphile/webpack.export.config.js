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
