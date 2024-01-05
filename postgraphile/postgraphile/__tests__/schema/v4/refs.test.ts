import * as core from "./core.js";

test(
  "prints a schema from refs schema",
  core.test(__filename, ["refs"], { disableDefaultMutations: true }),
);
