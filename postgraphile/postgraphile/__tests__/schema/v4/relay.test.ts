import { PgRelayPreset } from "../../../src/presets/relay.js";
import * as core from "./core.js";

test(
  "prints a schema optimized for Relay",
  core.test(__filename, ["d"], undefined, undefined, undefined, undefined, {
    extends: [PgRelayPreset],
  }),
);
