import * as core from "./core.ts";

test(
  "prints a schema with pgStrictFunctions set",
  core.test(__filename, ["a", "b", "c"], {}, undefined, undefined, true, {
    gather: {
      pgStrictFunctions: true,
    },
  }),
);
