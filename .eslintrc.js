module.exports = {
  parser: "typescript-eslint-parser",
  parserOptions: {
    sourceType: "module",
  },
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

    // TypeScript rules (there's currently no preset)
    "typescript/adjacent-overload-signatures": 'error',
    "typescript/class-name-casing": 'error',
    "typescript/explicit-function-return-type": 'error',
    "typescript/explicit-member-accessibility": 'error',
    "typescript/interface-name-prefix": 'error',
    "typescript/member-delimiter-style": 'error',
    "typescript/member-naming": 'error',
    "typescript/member-ordering": 'error',
    "typescript/no-angle-bracket-type-assertion": 'error',
    "typescript/no-array-constructor": 'error',
    "typescript/no-empty-interface": 'error',
    "typescript/no-explicit-any": 'error',
    "typescript/no-inferrable-types": 'error',
    "typescript/no-namespace": 'error',
    "typescript/no-non-null-assertion": 'error',
    "typescript/no-parameter-properties": 'error',
    "typescript/no-triple-slash-reference": 'error',
    "typescript/no-type-alias": 'error',
    "typescript/no-unused-vars": 'error',
    "typescript/no-use-before-define": 'error',
    "typescript/no-var-requires": 'error',
    "typescript/prefer-namespace-keyword": 'error',
    "typescript/type-annotation-spacing": 'error',
  },
};
