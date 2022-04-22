import webpack from "webpack";

export default {
  entry: "./src/bundle.tsx",
  output: {
    path: `${__dirname}/bundle`,
    filename: "graphile-inspect.min.js",
    library: "GraphileInspectBundle",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
