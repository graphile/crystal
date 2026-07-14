import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import * as core from "./core.ts";

const setupSql = readFileSync(
  resolve(__dirname, "../../function-overloads-schema.sql"),
  "utf8",
);

// Override functionResourceNameCompositeTypePrefix to allow cross-schema
// computed columns (the default only prefixes same-schema functions).
const CrossSchemaComputedColumnsPreset: GraphileConfig.Preset = {
  plugins: [
    {
      name: "CrossSchemaComputedColumnsPlugin",
      version: "0.0.0",
      inflection: {
        replace: {
          functionResourceNameCompositeTypePrefix(_prev, _options, { pgProc }) {
            if (pgProc.provolatile === "v") {
              return "";
            }
            const firstArg = pgProc.getArguments().find((a) => a.isIn);
            if (!firstArg || firstArg.type.typtype !== "c") {
              return "";
            }
            const prefix = firstArg.type.typname + "_";
            return pgProc.proname.startsWith(prefix) ? "" : prefix;
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
