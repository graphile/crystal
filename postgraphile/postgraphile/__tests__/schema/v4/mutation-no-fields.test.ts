import * as core from "./core.ts";

test(
  "prints a schema from a table with no mutable fields",
  core.test(__filename, "no_fields"),
);
