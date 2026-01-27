import { PostGraphileRelayPreset } from "../../../src/presets/relay.ts";
import * as core from "./core.ts";

test(
  "prints a schema optimized for Relay",
  core.test(__filename, ["d"], undefined, undefined, undefined, undefined, {
    extends: [PostGraphileRelayPreset],
  }),
);
