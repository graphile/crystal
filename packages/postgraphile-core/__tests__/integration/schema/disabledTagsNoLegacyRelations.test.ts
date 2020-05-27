import core from "./core";

test(
  "prints a schema without parsing tags and with legacy relations omitted",
  core.test("c", {
    enableTags: false,
    legacyRelations: "omit",
    setofFunctionsContainNulls: false,
  }),
);
