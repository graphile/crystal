import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./dcc-schema.ts",
  ignoreNoDocuments: true,
  generates: {
    "./dcc-types.ts": {
      plugins: ["typescript", "grafast"],
      config: {
        grafastModule: "../../dist/index.js",
        overridesFile: "./dcc-type-overrides.ts",
      },
    },
  },
};

export default config;
