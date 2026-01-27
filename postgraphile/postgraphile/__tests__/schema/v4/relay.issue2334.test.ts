import { assertInputObjectType } from "graphql";

import { PostGraphileRelayPreset } from "../../../src/presets/relay.ts";
import * as core from "./core.ts";

test(
  "prints a schema optimized for Relay",
  core.test(
    __filename,
    ["issue_2334"],
    { ignoreRBAC: false },
    (client) => client.query("set role postgraphile_test_authenticator"),
    (schema) => {
      const t = assertInputObjectType(schema.getType("BarPatch"));
      const f = t.getFields();
      // Explicitly this must not contain `fooByRowId`, `fooById`, `foo` or any
      // other related thing - permissions forbid it!
      expect(Object.keys(f)).toEqual(["col"]);
    },
    undefined,
    { extends: [PostGraphileRelayPreset] },
  ),
);
