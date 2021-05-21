module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:import/errors",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  plugins: ["jest", "graphql", "tsdoc", "simple-import-sort", "import"],
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  globals: {
    jasmine: false,
  },
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    // We need this for our `GraphileEngine` namespace
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],
    "no-confusing-arrow": 0,
    "no-else-return": 0,
    "no-underscore-dangle": 0,
    "no-restricted-syntax": 0,
    "no-await-in-loop": 0,
    "jest/no-focused-tests": 2,
    "jest/no-identical-title": 2,
    "tsdoc/syntax": 2,

    // Rules that we should enable:
    "@typescript-eslint/no-inferrable-types": "warn",
    "no-inner-declarations": "warn",

    /*
     * simple-import-sort seems to be the most stable import sorting currently,
     * disable others
     */
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off",
    "import/order": "off",

    "import/no-deprecated": "warn",
    "import/no-duplicates": "error",
  },
  overrides: [
    // Rules for plugins
    {
      files: [
        "packages/graphile-build/src/plugins/**/*.ts",
        "packages/graphile-build-pg/src/**/*.ts",
        "packages/graphile-utils/src/**/*.ts",
        "packages/pg-pubsub/src/**/*.ts",
        "packages/postgraphile-core/src/**/*.ts",
        "packages/subscriptions-lds/src/**/*.ts",
      ],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "graphql",
                message:
                  'Please refer to `build.graphql` instead, or use `import("graphql")` in type positions. (This helps us to avoid multiple `graphql` modules in the `node_modules` tree from causing issues for users.)',
              },
            ],
          },
        ],
      },
    },

    // Rules for TypeScript only
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      rules: {
        "no-dupe-class-members": "off",
        "no-undef": "off",
      },
    },

    // Stricter rules for source code
    {
      files: ["packages/*/src/**/*.ts", "packages/*/src/**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["tsconfig.json", "packages/*/tsconfig.json"],
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars-experimental": [
          "error",
          {
            ignoreArgsIfArgsAfterAreUsed: true,
          },
        ],
      },
    },

    // Rules for tests only
    {
      files: ["**/__tests__/**/*.{ts,js}"],
      rules: {
        // Disable these to enable faster test writing
        "prefer-const": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/explicit-function-return-type": "off",

        // We don't normally care about race conditions in tests
        "require-atomic-updates": "off",
      },
    },
  ],
};
