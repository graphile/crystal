const core = require("./core");

test(
  "prints a schema without posts headlines",
  core.test("a", {
    pgColumnFilter: attr => attr.name !== "headline",
    setofFunctionsContainNulls: false,
  })
);
