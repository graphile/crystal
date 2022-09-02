import * as core from "./core.js";

test(
  "prints a schema with the default options against inheritence schema",
  core.test(__filename, ["inheritence"]),
);
