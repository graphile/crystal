module.exports = {
  parser: "typescript-eslint-parser",
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  plugins: ["jest", "prettier", "graphql", "react", "typescript"],
  env: {
    jest: true,
    node: true,
    es6: true,
    browser: true,
  },
  globals: {
    jasmine: false,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all",
      },
    ],
    "no-confusing-arrow": 0,
    "no-else-return": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": [
      2,
      {
        argsIgnorePattern: "^_",
      },
    ],
    "no-restricted-syntax": 0,
    "no-await-in-loop": 0,
    camelcase: 0,
    "jest/no-focused-tests": 2,
    "jest/no-identical-title": 2,
  },
};
