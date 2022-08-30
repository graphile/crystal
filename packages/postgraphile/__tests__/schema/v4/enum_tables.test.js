const core = require("./core");

test(
  "prints a schema for enum_tables",
  core.test(__filename, ["enum_tables"], {})
);
