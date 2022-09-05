import * as core from "./core.js";

test(
  "prints a schema for index_expressions",
  core.test(__filename, ["index_expressions"], {
    disableDefaultMutations: true,
  }),
);
