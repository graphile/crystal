const core = require("./core");

test(
  "prints a schema without new relations and with legacy type names",
  core.test("c", {
    legacyRelations: "only",
    enableTags: false,
    legacyJsonUuid: true,
    setofFunctionsContainNulls: false,
  }),
);
