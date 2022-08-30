const core = require("./core");

test(
  "prints a schema with only simple collections",
  core.test(__filename, "c", {
    simpleCollections: "only",
    setofFunctionsContainNulls: false,
  })
);
