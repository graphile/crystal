module.exports = {
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-syntax-object-rest-spread",
  ],
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "8.6",
        },
      },
    ],
    "@babel/flow",
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
        "@babel/flow",
      ],
    },
  },
};
