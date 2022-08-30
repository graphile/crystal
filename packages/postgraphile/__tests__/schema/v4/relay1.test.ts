const core = require("./core");

test(
  "prints a schema with Relay 1 style ids",
  core.test(__filename, "c", {
    classicIds: true,
    setofFunctionsContainNulls: false,
  })
);
