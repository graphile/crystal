import * as core from "./core.ts";

test(
  "prints a schema for enum_tables",
  core.test(
    __filename,
    ["enum_tables"],
    {},
    undefined,
    (_schema, introspectionPasses) => {
      expect(introspectionPasses).toBeLessThanOrEqual(4);
    },
  ),
);
