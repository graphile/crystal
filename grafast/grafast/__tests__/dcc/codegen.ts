import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./dcc-schema.ts",
  ignoreNoDocuments: true,
  generates: {
    "./dcc-types.ts": {
      plugins: ["./grafast-types-plugin.ts"],
      config: {
        grafastModule: "../../dist",
        overridesFile: "./dcc-type-overrides.ts",
      },
    },
  },
};

export default config;
