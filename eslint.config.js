const path = require("path");
const fs = require("fs");
const { defineConfig, globalIgnores } = require("eslint/config");

const babelParser = require("@babel/eslint-parser");

const { fixupConfigRules, fixupPluginRules } = require("@eslint/compat");

const jest = require("eslint-plugin-jest");
const graphql = require("eslint-plugin-graphql");
const tsdoc = require("eslint-plugin-tsdoc");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const _import = require("eslint-plugin-import");
const graphileExport = require("eslint-plugin-graphile-export");
const reactHooks = require("eslint-plugin-react-hooks");
const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const lintIgnore = fs.readFileSync(
  path.resolve(__dirname, ".lintignore"),
  "utf8",
);
const gitIgnore = fs.readFileSync(
  path.resolve(__dirname, ".gitIgnore"),
  "utf8",
);
const globalIgnoresFromFile = `${lintIgnore}\n${gitIgnore}`
  .split("\n")
  .map((line) => line.trim())
  // TODO: support `!` unfiltering. Currently ignored because we only use it in .yarn
  .filter((line) => line && !line.startsWith("#") && !line.startsWith("!"))
  .map((line) => {
    let text = line;
    text = text.startsWith("/") ? text.substring(1) : `**/${text}`;
    text = text.endsWith("/") ? text + "**" : text;
    return text;
  });

const fixupExtends = (...strings) =>
  fixupConfigRules(compat.extends(...strings));

const config = {
  languageOptions: {
    parser: babelParser,
    sourceType: "module",

    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },

    globals: {
      jasmine: false,
      ...globals.jest,
      ...globals.node,
    },
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  extends: fixupExtends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:graphile-export/recommended",
    "prettier",
  ),

  plugins: {
    jest,
    graphql,
    tsdoc,
    "simple-import-sort": simpleImportSort,
    import: fixupPluginRules(_import),
    "graphile-export": fixupPluginRules(graphileExport),
    "react-hooks": fixupPluginRules(reactHooks),
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
    // This needs full type-checking now (apparently?)
    "@typescript-eslint/consistent-type-imports": "off",
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
};

// This object only exists to make our new eslint.config.js look more like the old .eslintrc.js
const oldConfig = {
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
        // Empty interfaces for later extending
        "@typescript-eslint/no-empty-object-type": "off",
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
      files: ["**/*.ts", "**/*.tsx"],

      languageOptions: {
        parser: tsParser,
      },

      rules: {
        "no-dupe-class-members": "off",
        "no-undef": "off",
        // This rule doesn't understand import of './js'
        "import/no-unresolved": "off",
      },
    },

    // Rules for JavaScript only
    {
      files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
      rules: {
        "tsdoc/syntax": "off",
        "import/extensions": "off",
        "@typescript-eslint/no-require-imports": "off",
      },
    },

    // Stricter rules for source code
    {
      files: ["*/*/src/**/*.ts", "*/*/src/**/*.tsx"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: true,
        },
      },
      rules: {
        "@typescript-eslint/consistent-type-imports": "error",
      },
    },

    // Rules for tests only
    {
      files: ["**/__tests__/**/*.{ts,js}"],
      rules: {
        // Disable these to enable faster test writing
        "prefer-const": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-expressions": "off",
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
      extends: compat.extends("plugin:react/recommended"),
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
      ignores: ["utils/graphile-config/src/loadConfig.ts"],
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

module.exports = defineConfig([
  config,
  ...oldConfig.overrides,
  globalIgnores(globalIgnoresFromFile),
]);
