module.exports = {
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    // TODO:v5: remove this?
    "@babel/plugin-syntax-object-rest-spread",
  ],
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "12.16",
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
