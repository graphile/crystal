// Babel config, used by Jest
module.exports = {
  plugins: [],
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
      plugins: [],
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
