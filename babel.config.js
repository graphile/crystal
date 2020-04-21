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
          node: "12.16",
        },
      },
    ],
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
      ],
    },
  },
};
