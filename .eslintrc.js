module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["jest", "graphql", "tsdoc"],
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  globals: {
    jasmine: false,
  },
  rules: {
    "prettier/prettier": "error",

    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-empty-interface": "off",
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
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/no-inferrable-types": "warn",
    "no-inner-declarations": "warn",
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
                  'Please refer to `build.graphql` instead, or use `import("graphql")` in value positions. (This helps us to avoid multiple `graphql` modules in the `node_modules` tree from causing issues.)',
              },
            ],
          },
        ],
      },
    },

    // Rules for Flow only
    {
      files: ["*.js", "*.jsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
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

    // Rules for tests only
    {
      files: ["**/__tests__/**/*.{ts,js}"],
      rules: {
        "prefer-const": "off",
        "@typescript-eslint/no-unused-vars": "off",

        // We don't normally care about race conditions in tests
        "require-atomic-updates": "warn",
      },
    },
  ],
};
