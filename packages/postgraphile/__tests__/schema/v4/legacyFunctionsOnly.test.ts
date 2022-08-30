const core = require("./core");

test(
  "prints a schema with only legacy functions",
  core.test(__filename, ["c"], {
    legacyFunctionsOnly: true,
  })
);
