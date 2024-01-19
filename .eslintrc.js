module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:graphile-export/recommended",
    "prettier",
  ],
  plugins: [
    "jest",
    "graphql",
    "tsdoc",
    "simple-import-sort",
    "import",
    "graphile-export",
    "react-hooks",
  ],
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  globals: {
    jasmine: false,
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    // We need this for our `GraphileEngine` namespace
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/consistent-type-imports": "error",
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

    // Rules we've disabled for now because they're so noisy (but we should really address)
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],

    /*
     * simple-import-sort seems to be the most stable import sorting currently,
     * disable others
     */
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off",
    "import/order": "off",

    "import/extensions": ["error", "ignorePackages"],
    "import/no-deprecated": "warn",

    // Apply has been more optimised than spread, use whatever feels right.
    "prefer-spread": "off",

    // note you must disable the base rule as it can report incorrect errors
    "no-duplicate-imports": "off",
    "import/no-duplicates": "error",
  },
  overrides: [
    // Rules for core plugins
    {
      files: [
        "graphile-build/graphile-build/src/plugins/**/*.ts",
        "graphile-build/graphile-build-pg/src/**/*.ts",
      ],
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "ImportDeclaration[importKind!='type'][source.value='graphql']",
            message:
              "Please refer to `build.graphql` instead, or use `import type` for type-only imports. (This helps us to avoid multiple `graphql` modules in the `node_modules` tree from causing issues for users.)",
          },
        ],
      },
    },

    // Rules for non-core plugins
    {
      files: ["graphile-build/graphile-utils/src/**/*.ts"],
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "ImportDeclaration[importKind!='type'][source.value='graphql']",
            message:
              "Please refer to `build.graphql` instead, or use `import type` for type-only imports. (This helps us to avoid multiple `graphql` modules in the `node_modules` tree from causing issues for users.)",
          },
          {
            selector:
              "ImportDeclaration[importKind!='type'][source.value='grafast']",
            message:
              "Please refer to `build.grafast` instead, or use `import type` for type-only imports. (This helps us to avoid multiple `grafast` modules in the `node_modules` tree from causing issues for users.)",
          },
        ],
      },
    },

    // Rules for interfaces.ts files
    {
      files: ["**/interfaces.ts"],
      rules: {
        "no-restricted-syntax": [
          "error",
          {
            selector: "TSModuleDeclaration[kind='global']",
            message:
              "No `declare global` allowed in `interface.ts` files since these type-only files may not be imported by dependents, recommend adding to `index.ts` instead.",
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
        // This rule doesn't understand import of './js'
        "import/no-unresolved": "off",
      },
    },

    // Rules for JavaScript only
    {
      files: ["*.js", "*.jsx", "*.mjs", "*.cjs"],
      rules: {
        "tsdoc/syntax": "off",
        "import/extensions": "off",
      },
    },

    // Stricter rules for source code
    {
      files: ["*/*/src/**/*.ts", "*/*/src/**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: true,
      },
      rules: {},
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

    // React rules
    {
      files: [
        "grafast/ruru/src/**/*.ts",
        "grafast/ruru/src/**/*.tsx",
        "**/website/src/**",
      ],
      extends: ["plugin:react/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": [
          "warn",
          {
            enableDangerousAutofixThisMayCauseInfiniteLoops: true,
          },
        ],

        // Stuff I don't care about
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
      },
    },

    {
      files: [
        "**/vendor/**/__tests__/**/*.ts",
        "**/vendor/**/__tests__/**/*.tsx",
        "**/vendor/**/__testUtils__/**/*.ts",
        "**/vendor/**/__testUtils__/**/*.tsx",
        "**/website/examples/**",
        "graphile-build/graphile-utils/__tests__/*Plugin.ts",
      ],
      rules: {
        "graphile-export/exhaustive-deps": 0,
        "graphile-export/export-methods": 0,
        "graphile-export/export-instances": 0,
        "graphile-export/export-subclasses": 0,
        "graphile-export/no-nested": 0,
      },
    },

    {
      files: ["**/website/**"],
      rules: {
        "import/no-unresolved": "off",
      },
    },

    // Don't use Node.js builtins
    {
      files: ["grafast/grafast/src/**", "utils/graphile-config/src/**"],
      excludedFiles: ["utils/graphile-config/src/loadConfig.ts"],
      rules: {
        "@typescript-eslint/no-restricted-imports": [
          "error",
          {
            paths: [
              "assert",
              "buffer",
              "child_process",
              "cluster",
              "crypto",
              "dgram",
              "dns",
              "domain",
              "events",
              "freelist",
              "fs",
              "fs/promises",
              { name: "http", allowTypeImports: true },
              "https",
              "module",
              "net",
              "os",
              "path",
              "punycode",
              "querystring",
              "readline",
              "repl",
              "smalloc",
              "stream",
              "string_decoder",
              "sys",
              "timers",
              "tls",
              "tracing",
              "tty",
              "url",
              "util",
              "vm",
              "zlib",
            ],
            patterns: ["node:*"],
          },
        ],
      },
    },
  ],
};
