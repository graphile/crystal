import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./examples/smallExample/schema.mts",
  ignoreNoDocuments: true,
  generates: {
    "./examples/smallExample/schema-generated.mts": {
      plugins: ["typescript", "grafast"],
      config: {
        overridesFile: "./schema-manual-types.mts",
      },
    },
  },
};

export default config;
