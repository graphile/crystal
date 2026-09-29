import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { PgFunctionOverloadsPreset } from "graphile-build-pg";

import * as core from "./core.ts";

const setupSql = readFileSync(
  resolve(__dirname, "../../function-overloads-schema.sql"),
  "utf8",
);

test(
  "prints a schema with overloaded computed column functions",
  core.test(
    __filename,
    ["function_overloads", "function_overloads_other_schema"],
    {},
    setupSql,
    undefined,
    true,
    PgFunctionOverloadsPreset,
  ),
);
