import * as core from "./core.js";

test(
  "prints a schema from a table with no mutable fields",
  core.test(__filename, "no_fields"),
);
