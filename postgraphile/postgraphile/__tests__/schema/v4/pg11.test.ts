import * as core from "./core.ts";

test(
  "prints a schema to test PG11-specific features with default options",
  core.test(__filename, ["pg11"]),
);
