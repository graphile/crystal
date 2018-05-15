const core = require("./core");

test(
  "prints a schema with simple collections",
  core.test("c", {
    simpleCollections: "both",
    setofFunctionsContainNulls: false,
  })
);
