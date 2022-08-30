import * as core from "./core.js";

test(
  "prints a schema for enum_tables",
  core.test(__filename, ["enum_tables"], {}),
);
