const core = require("./core");

test(
  "prints a schema with both simple collections and relay connections",
  core.test("c", {
    simpleCollections: "both",
    setofFunctionsContainNulls: false,
  })
);

test(
  "prints a schema with only simple collections",
  core.test("c", {
    simpleCollections: "only",
    setofFunctionsContainNulls: false,
  })
);
