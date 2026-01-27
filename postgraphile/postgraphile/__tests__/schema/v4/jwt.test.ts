import * as core from "./core.ts";

test(
  "prints a schema with a JWT generating mutation",
  core.test(__filename, "b", {
    jwtSecret: "secret",
    jwtPgTypeIdentifier: "b.jwt_token",
  }),
);
