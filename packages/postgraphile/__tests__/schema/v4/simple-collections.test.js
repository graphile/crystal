const core = require("./core");

test(
  "prints a schema with both simple collections and relay connections",
  core.test(__filename, "c", {
    simpleCollections: "both",
    setofFunctionsContainNulls: false,
  })
);
