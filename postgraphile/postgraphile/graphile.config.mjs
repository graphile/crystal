/* eslint-disable import/no-unresolved */
import "postgraphile";

import { context } from "grafast";
import { StreamDeferPlugin } from "graphile-build";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { postgraphilePresetAmber } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";
import { makePgConfigs } from "postgraphile";

/** @type {GraphileConfig.Plugin } */
/*
const PrimaryKeyMutationsOnlyPlugin = {
  name: "PrimaryKeyMutationsOnlyPlugin",
  version: "0.0.0",

  gather: {
    hooks: {
      pgIntrospection_introspection(info, event) {
        const { introspection } = event;
        for (const pgConstraint of introspection.constraints) {
          if (pgConstraint.contype === "u") {
            const tags = pgConstraint.getTags();
            const newBehavior = ["-update", "-delete"];
            if (typeof tags.behavior === "string") {
              newBehavior.push(tags.behavior);
            } else if (Array.isArray(tags.behavior)) {
              newBehavior.push(...tags.behavior);
            }
            tags.behavior = newBehavior;
            console.log(pgConstraint.getClass().relname, newBehavior);
          }
        }
      },
    },
  },
};
*/

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
    // PrimaryKeyMutationsOnlyPlugin,
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
  server: {
    graphqlPath: "/v2/graphql",
  },
  grafast: {
    context: {
      mol: 42,
    },
  },
  pgConfigs: makePgConfigs(
    // Database connection string:
    process.env.DATABASE_URL,
    // List of schemas to expose:
    process.env.DATABASE_SCHEMAS?.split(",") ?? ["public"],
  ),
};

export default preset;
