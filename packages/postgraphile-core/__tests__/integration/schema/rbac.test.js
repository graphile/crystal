const core = require("./core");

test(
  "prints a schema from non-root role, using RBAC permissions",
  core.test(["a", "b", "c"], {}, client =>
    client.query("set role postgraphile_test_authenticator")
  )
);
test(
  "prints a schema from non-root role, with RBAC ignored",
  core.test(["a", "b", "c"], { ignoreRBAC: true }, client =>
    client.query("set role postgraphile_test_authenticator")
  )
);
