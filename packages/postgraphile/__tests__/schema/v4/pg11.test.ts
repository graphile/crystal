const core = require("./core");

test(
  "prints a schema to test PG11-specific features with default options",
  core.test(__filename, ["pg11"])
);
