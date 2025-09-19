import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/examples/smallExample/schema.mts",
  ignoreNoDocuments: true,
  generates: {
    "./src/examples/smallExample/schema-generated.mts": {
      plugins: ["typescript", "grafast"],
      config: {
        overridesFile: "./schema-manual-types.mts",
      },
    },
  },
};

export default config;
