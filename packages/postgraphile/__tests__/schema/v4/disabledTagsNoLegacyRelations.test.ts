const core = require("./core");

test(
  "prints a schema without parsing tags and with legacy relations omitted",
  core.test(__filename, "c", {
    enableTags: false,
    legacyRelations: "omit",
    setofFunctionsContainNulls: false,
  })
);
