import { PostGraphileRelayPreset } from "../../../src/presets/relay.js";
import * as core from "./core.js";

test(
  "prints a schema optimized for Relay",
  core.test(
    __filename,
    ["issue_2334"],
    { ignoreRBAC: false },
    (client) => client.query("set role postgraphile_test_authenticator"),
    undefined,
    undefined,
    { extends: [PostGraphileRelayPreset] },
  ),
);
