import * as core from "./core.js";

test(
  "prints a schema with pgStrictFunctions set",
  core.test(__filename, ["a", "b", "c"], {}, undefined, undefined, true, {
    gather: {
      pgStrictFunctions: true,
    },
  }),
);
