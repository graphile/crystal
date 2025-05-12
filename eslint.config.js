const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const babelParser = require("@babel/eslint-parser");

const {
    fixupConfigRules,
    fixupPluginRules,
} = require("@eslint/compat");

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

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: babelParser,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },

        globals: {
            ...globals.jest,
            ...globals.node,
            jasmine: false,
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/typescript",
        "plugin:graphile-export/recommended",
        "prettier",
    )),

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
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "no-confusing-arrow": 0,
        "no-else-return": 0,
        "no-underscore-dangle": 0,
        "no-restricted-syntax": 0,
        "no-await-in-loop": 0,
        "jest/no-focused-tests": 2,
        "jest/no-identical-title": 2,
        "tsdoc/syntax": 2,
        "@typescript-eslint/no-inferrable-types": "warn",
        "no-inner-declarations": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            args: "after-used",
            ignoreRestSiblings: true,
        }],

        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "sort-imports": "off",
        "import/order": "off",
        "import/extensions": ["error", "ignorePackages"],
        "import/no-deprecated": "warn",
        "prefer-spread": "off",
        "no-duplicate-imports": "off",
        "import/no-duplicates": "error",
    },
}, {
    files: [
        "graphile-build/graphile-build/src/plugins/**/*.ts",
        "graphile-build/graphile-build-pg/src/**/*.ts",
    ],

    rules: {
        "no-restricted-syntax": ["error", {
            selector: "ImportDeclaration[importKind!='type'][source.value='graphql']",
            message: "Please refer to `build.graphql` instead, or use `import type` for type-only imports. (This helps us to avoid multiple `graphql` modules in the `node_modules` tree from causing issues for users.)",
        }],
    },
}, {
    files: ["graphile-build/graphile-utils/src/**/*.ts"],

    rules: {
        "no-restricted-syntax": ["error", {
            selector: "ImportDeclaration[importKind!='type'][source.value='graphql']",
            message: "Please refer to `build.graphql` instead, or use `import type` for type-only imports. (This helps us to avoid multiple `graphql` modules in the `node_modules` tree from causing issues for users.)",
        }, {
            selector: "ImportDeclaration[importKind!='type'][source.value='grafast']",
            message: "Please refer to `build.grafast` instead, or use `import type` for type-only imports. (This helps us to avoid multiple `grafast` modules in the `node_modules` tree from causing issues for users.)",
        }],
    },
}, {
    files: ["**/interfaces.ts"],

    rules: {
        "no-restricted-syntax": ["error", {
            selector: "TSModuleDeclaration[kind='global']",
            message: "No `declare global` allowed in `interface.ts` files since these type-only files may not be imported by dependents, recommend adding to `index.ts` instead.",
        }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
        parser: tsParser,

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/consistent-type-imports": "error",
        "no-dupe-class-members": "off",
        "no-undef": "off",
        "import/no-unresolved": "off",
    },
}, {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],

    rules: {
        "@typescript-eslint/consistent-type-imports": "off",
        "tsdoc/syntax": "off",
        "import/extensions": "off",
    },
}, {
    files: ["*/*/src/**/*.ts", "*/*/src/**/*.tsx"],

    languageOptions: {
        parser: tsParser,

        parserOptions: {
            project: true,
        },
    },

    rules: {},
}, {
    files: ["**/__tests__/**/*.{ts,js}"],

    rules: {
        "prefer-const": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "require-atomic-updates": "off",
    },
}, {
    files: [
        "grafast/ruru/src/**/*.ts",
        "grafast/ruru/src/**/*.tsx",
        "**/website/src/**",
    ],

    extends: compat.extends("plugin:react/recommended"),

    rules: {
        "react-hooks/rules-of-hooks": "error",

        "react-hooks/exhaustive-deps": ["warn", {
            enableDangerousAutofixThisMayCauseInfiniteLoops: true,
        }],

        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
    },
}, {
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
}, {
    files: ["**/website/**"],

    rules: {
        "import/no-unresolved": "off",
    },
}, {
    files: ["grafast/grafast/src/**", "utils/graphile-config/src/**"],
    ignores: ["utils/graphile-config/src/loadConfig.ts"],

    rules: {
        "@typescript-eslint/no-restricted-imports": ["error", {
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
                {
                    name: "http",
                    allowTypeImports: true,
                },
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
        }],
    },
}, globalIgnores([
    "**/package.json",
    "**/node_modules",
    ".vscode/pnpify",
    "utils/pg-sql2/examples",
    "postgraphile/postgraphile/sponsors.json",
    "postgraphile/postgraphile/postgraphiql",
    "postgraphile/postgraphile/assets",
    "postgraphile/postgraphile/src/assets",
    "postgraphile/postgraphile/exported-schema.js",
    "postgraphile/postgraphile/exported-schema.webpacked.js",
    "grafast/ruru/bundle/ruru.min.js",
    "grafast/ruru/bundle/ruru.min.js.LICENSE.txt",
    "graphile-build/graphile-build-pg/webpacked",
    "graphile-build/graphile-build-pg/exported-schema-for-webpack.mjs",
    "graphile-build/graphile-build-pg/schema-export-output.mjs",
    "**/__tests__/**/*.1.graphql",
    "**/__tests__/**/*.json5",
    "**/__tests__/**/*.mermaid",
    "**/__tests__/**/*.export.mjs",
    "wal2json",
    "**/dist",
    "**/CHANGELOG.md",
    "**/_LOCAL",
    "**/.yarn",
    "**/.pnp.*",
    "grafast/grafast/vendor",
    "postgraphile/postgraphile/.tests_tmp/",
    "**/.docusaurus",
    "*/website/build",
    "**/contrib",
])]);
