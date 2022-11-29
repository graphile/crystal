/* eslint-disable import/no-unresolved */
import "postgraphile";

import { context } from "grafast";
import { StreamDeferPlugin } from "graphile-build";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { postgraphilePresetAmber } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

/** @type {GraphileConfig.Preset} */
const preset = {
  plugins: [
    StreamDeferPlugin,
    makeExtendSchemaPlugin({
      typeDefs: gql`
        extend type Query {
          mol: Int
        }
      `,
      plans: {
        Query: {
          mol() {
            return context().get("mol");
          },
        },
      },
    }),
  ],
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
  grafast: {
    context: {
      mol: 42,
    },
  },
};

export default preset;
