// Babel config, used by Jest
module.exports = {
  plugins: ["@babel/plugin-transform-modules-commonjs"],
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "16.12",
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  env: {
    test: {
      plugins: ["babel-plugin-transform-import-meta"],
      presets: [
        [
          "@babel/env",
          {
            targets: {
              node: "current",
            },
          },
        ],
        "@babel/preset-typescript",
      ],
    },
  },
};
