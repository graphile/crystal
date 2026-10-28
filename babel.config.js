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
      plugins: [
        "babel-plugin-transform-import-meta",
        // Add support for `import.meta.main` in jest
        function transformImportMetaMain({ types: t }) {
          return {
            visitor: {
              MemberExpression(path) {
                const { node } = path;
                if (
                  !node.computed &&
                  t.isMetaProperty(node.object) &&
                  node.object.meta.name === "import" &&
                  node.object.property.name === "meta" &&
                  t.isIdentifier(node.property, { name: "main" })
                ) {
                  path.replaceWith(
                    t.binaryExpression(
                      "===",
                      t.memberExpression(
                        t.identifier("require"),
                        t.identifier("main"),
                      ),
                      t.identifier("module"),
                    ),
                  );
                }
              },
            },
          };
        },
      ],
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
