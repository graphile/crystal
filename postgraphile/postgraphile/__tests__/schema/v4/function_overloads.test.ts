import * as core from "./core.ts";

test(
  "prints a schema with overloaded computed column functions",
  core.test(__filename, ["function_overloads", "function_overloads_other_schema"]),
);
