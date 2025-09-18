import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/examples/smallExample/schema.ts",
  ignoreNoDocuments: true,
  generates: {
    "./src/examples/smallExample/schema-generated.ts": {
      plugins: ["typescript", "grafast"],
      config: {
        overridesFile: "./schema-manual-types",
      },
    },
  },
};

export default config;
