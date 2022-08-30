import * as core from "./core.js";

test(
  "prints a schema without posts headlines",
  core.test(__filename, "a", {
    pgColumnFilter: (attr) => attr.name !== "headline",
    setofFunctionsContainNulls: false,
  }),
);
