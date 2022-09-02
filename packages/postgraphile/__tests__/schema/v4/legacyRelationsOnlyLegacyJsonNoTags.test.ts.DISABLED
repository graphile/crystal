import * as core from "./core.js";

test(
  "prints a schema without new relations and with legacy type names",
  core.test(__filename, "c", {
    legacyRelations: "only",
    enableTags: false,
    legacyJsonUuid: true,
    setofFunctionsContainNulls: false,
  }),
);
