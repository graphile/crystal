import * as core from "./core.ts";

test(
  "prints a schema for index_expressions",
  core.test(__filename, ["index_expressions"], {
    disableDefaultMutations: true,
  }),
);
