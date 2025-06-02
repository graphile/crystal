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
      // Due to the following Prettier issue, it's unsafe to proseWrap MDX currently
      // https://github.com/prettier/prettier/issues/13586
      files: ["**/website/**/*.mdx", "**/website/**/*.md"],
      options: {
        proseWrap: "preserve",
      },
    },
    {
      // Wrapping commands in yaml is gross
      files: [".github/**/*.yml"],
      options: {
        proseWrap: "preserve",
      },
    },
    {
      files: "grafast/grafast/vendor/graphql-js/**",
      options: {
        singleQuote: true,
      },
    },
  ],
};
