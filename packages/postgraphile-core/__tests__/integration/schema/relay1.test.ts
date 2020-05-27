import * as core from "./core";

test(
  "prints a schema with Relay 1 style ids",
  core.test("c", {
    classicIds: true,
    setofFunctionsContainNulls: false,
  }),
);
