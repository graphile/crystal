import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import * as core from "./core.ts";

const setupSql = readFileSync(
  resolve(__dirname, "../../function-overloads-schema.sql"),
  "utf8",
);

// Override functionResourceNameShouldPrefixCompositeType to allow cross-schema
// computed columns (the default only allows same-schema).
const CrossSchemaComputedColumnsPreset: GraphileConfig.Preset = {
  plugins: [
    {
      name: "CrossSchemaComputedColumnsPlugin",
      version: "0.0.0",
      inflection: {
        replace: {
          functionResourceNameShouldPrefixCompositeType() {
            return true;
          },
        },
      },
    },
  ],
};

test(
  "prints a schema with overloaded computed column functions",
  core.test(
    __filename,
    ["function_overloads", "function_overloads_other_schema"],
    {},
    setupSql,
    undefined,
    true,
    CrossSchemaComputedColumnsPreset,
  ),
);
