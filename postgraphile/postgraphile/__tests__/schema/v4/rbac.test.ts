import * as core from "./core.ts";

test(
  "prints a schema from non-root role, using RBAC permissions",
  core.test(
    __filename,
    ["a", "b", "c"],
    { ignoreRBAC: false },
    async (client) => {
      await client.query(
        "revoke usage on schema enum_tables from postgraphile_test_authenticator",
      );
      await client.query("set role postgraphile_test_authenticator");
    },
  ),
);
