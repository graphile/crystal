module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["jest", "prettier", "flowtype", "graphql"],
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  globals: {
    jasmine: false,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
      },
    ],
    "comma-dangle": [
      2,
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
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
    "flowtype/boolean-style": [2, "boolean"],
    "flowtype/delimiter-dangle": [2, "always-multiline"],
    "flowtype/no-primitive-constructor-types": 2,
    "flowtype/no-types-missing-file-annotation": 2,
    "flowtype/no-weak-types": 2,
    "flowtype/object-type-delimiter": [2, "comma"],
    "flowtype/require-valid-file-annotation": 2,
    "flowtype/semi": [2, "always"],
    "flowtype/define-flow-type": 1,
    "flowtype/use-flow-type": 1,
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
};
