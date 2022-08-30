const core = require("./core");

test(
  "prints a schema from non-root role, with RBAC ignored",
  core.test(__filename, ["a", "b", "c"], { ignoreRBAC: true }, client =>
    client.query("set role postgraphile_test_authenticator")
  )
);
