const core = require("./core");

test(
  "prints a schema with a JWT generating mutation",
  core.test("b", {
    jwtSecret: "secret",
    jwtPgTypeIdentifier: "b.jwt_token",
  })
);
