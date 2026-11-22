import * as core from "./core.ts";

test(
  "prints a schema with the default options for the nested_arrays schema",
  core.test(__filename, ["nested_arrays"]),
);
