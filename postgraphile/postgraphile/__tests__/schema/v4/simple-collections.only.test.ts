import * as core from "./core.ts";

test(
  "prints a schema with only simple collections",
  core.test(__filename, "c", {
    simpleCollections: "only",
    setofFunctionsContainNulls: false,
  }),
);
