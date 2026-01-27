import * as core from "./core.ts";

test(
  "prints a schema with both simple collections and relay connections",
  core.test(__filename, "c", {
    simpleCollections: "both",
    setofFunctionsContainNulls: false,
  }),
);
