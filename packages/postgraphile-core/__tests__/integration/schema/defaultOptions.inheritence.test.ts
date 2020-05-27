import * as core from "./core";

test(
  "prints a schema with the default options against inheritence schema",
  core.test(["inheritence"]),
);
