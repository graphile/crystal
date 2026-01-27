import * as core from "./core.ts";

test(
  "prints a schema with Relay 1 style ids",
  core.test(__filename, "c", {
    classicIds: true,
    setofFunctionsContainNulls: false,
  }),
);
