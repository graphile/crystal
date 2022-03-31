// Babel config, used by Jest?
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
  ],
  env: {
    test: {
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
