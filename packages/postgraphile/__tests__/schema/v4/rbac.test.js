const core = require("./core");

test(
  "prints a schema from non-root role, using RBAC permissions",
  core.test(__filename, ["a", "b", "c"], { ignoreRBAC: false }, client =>
    client.query("set role postgraphile_test_authenticator")
  )
);
