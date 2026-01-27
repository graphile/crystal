import * as core from "./core.ts";

test(
  "prints a schema for polymorphic",
  core.test(__filename, ["polymorphic"], {}),
);
