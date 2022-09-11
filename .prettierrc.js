module.exports = {
  trailingComma: "all",
  proseWrap: "always",
  overrides: [
    {
      files: "CRYSTAL_FLOW.md",
      options: {
        printWidth: 120,
      },
    },
    {
      files: "packages/grafast/vendor/graphql-js/**",
      options: {
        singleQuote: true,
      },
    },
  ],
};
