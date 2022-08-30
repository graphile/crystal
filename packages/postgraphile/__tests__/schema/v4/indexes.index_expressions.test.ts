const core = require("./core");

test(
  "prints a schema for index_expressions",
  core.test(__filename, ["index_expressions"], {
    disableDefaultMutations: true,
  })
);
