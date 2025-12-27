import "postgraphile";
import "postgraphile/adaptors/pg";
import "postgraphile/utils";

import PostGraphileAmberPreset from "postgraphile/presets/amber";
import { PgLazyJWTPreset } from "postgraphile/presets/lazy-jwt";
import { PostGraphileRelayPreset } from "postgraphile/presets/relay";
import { makeV4Preset } from "./src/presets/v4";

const preset: GraphileConfig.Preset = {
  // List to extend so we can declare the inflectors in the docs
  extends: [
    PostGraphileAmberPreset,
    PgLazyJWTPreset,
    PostGraphileRelayPreset,
    makeV4Preset({}),
  ],
};
export default preset;
