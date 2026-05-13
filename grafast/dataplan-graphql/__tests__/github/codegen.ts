import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.ts",
  ignoreNoDocuments: true,
  generates: {
    "./schema-generated.ts": {
      plugins: ["typescript", "grafast"],
      config: {
        overridesFile: "./schema-manual-types.ts",
      },
    },
  },
};

export default config;
