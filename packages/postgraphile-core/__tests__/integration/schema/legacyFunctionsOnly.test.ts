import * as core from "./core";

test(
  "prints a schema with only legacy functions",
  core.test(["c"], {
    legacyFunctionsOnly: true,
  }),
);
