import * as core from "./core.ts";

test(
  "prints a schema with the default options for the nested_arrays schema",
  core.testDefaultOptions(__filename, ["nested_arrays"]),
);
