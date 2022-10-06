/* eslint-disable import/no-unresolved */
import "postgraphile";

import { StreamDeferPlugin } from "graphile-build";
import postgraphilePresetAmber from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

/** @type {GraphileConfig.Preset} */
const preset = {
  plugins: [StreamDeferPlugin],
  extends: [
    postgraphilePresetAmber,
    makeV4Preset({
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
    }),
  ],
  inflection: {},
  gather: {},
  schema: {},
  server: {},
};

export default preset;
