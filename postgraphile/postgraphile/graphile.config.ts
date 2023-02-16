/* eslint-disable import/no-unresolved */
import "postgraphile";
import "grafserv/node";

import { makePgConfig } from "@dataplan/pg/adaptors/pg";
import { context, listen, object } from "grafast";
import { StreamDeferPlugin } from "graphile-build";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { postgraphilePresetAmber } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";
import { jsonParse } from "@dataplan/json";

/*
const PrimaryKeyMutationsOnlyPlugin: GraphileConfig.Plugin = {
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

const preset: GraphileConfig.Preset = {
  plugins: [
    StreamDeferPlugin,
    makeExtendSchemaPlugin({
      typeDefs: gql`
        extend type Query {
          mol: Int
        }
        extend type Subscription {
          sub(topic: String!): Int
        }
      `,
      plans: {
        Query: {
          mol() {
            return context().get("mol");
          },
        },
        Subscription: {
          // Test via SQL: `NOTIFY test, '{"a":40}';`
          sub(_$root, args) {
            const $topic = args.get("topic");
            const $pgSubscriber = context().get("pgSubscriber");
            return listen($pgSubscriber, $topic, ($payload) =>
              object({ sub: jsonParse($payload).get("a" as never) }),
            );
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
      dynamicJson: true,
    }),
  ],
  inflection: {},
  gather: {},
  schema: {},
  server: {
    graphqlPath: "/v2/graphql",
    websockets: true,
  },
  grafast: {
    context: {
      mol: 42,
    },
  },
  pgConfigs: [
    makePgConfig({
      // Database connection string:
      connectionString: process.env.DATABASE_URL,
      // List of schemas to expose:
      schemas: process.env.DATABASE_SCHEMAS?.split(",") ?? ["public"],
      // Enable LISTEN/NOTIFY client
      pubsub: true,
    }),
  ],
}; /* satisfies GraphileConfig.Preset */

export default preset;
