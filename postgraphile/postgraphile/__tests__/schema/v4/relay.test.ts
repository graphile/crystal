import * as core from "./core.js";
import { PgRelayPreset } from "../../../src/presets/relay.js";

test(
  "prints a schema optimized for Relay",
  core.test(__filename, ["d"], undefined, undefined, undefined, undefined, {
    extends: [PgRelayPreset],
  }),
);
