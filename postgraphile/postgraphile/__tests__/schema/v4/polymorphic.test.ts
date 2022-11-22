import * as core from "./core.js";

test(
  "prints a schema for polymorphic",
  core.test(__filename, ["polymorphic"], {}),
);
