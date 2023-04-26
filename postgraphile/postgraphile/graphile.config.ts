/* eslint-disable import/no-unresolved */
import "postgraphile";
import "grafserv/node";

import { jsonParse } from "@dataplan/json";
import { makePgService } from "@dataplan/pg/adaptors/pg";
import PersistedPlugin from "@grafserv/persisted";
import { context, listen, object } from "grafast";
import { StreamDeferPlugin } from "graphile-build";
import { EXPORTABLE } from "graphile-export";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { postgraphilePresetAmber } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import { PgManyToManyPreset } from "../../contrib/pg-many-to-many/dist/index.js";
import { PostGraphileConnectionFilterPreset } from "../../contrib/postgraphile-plugin-connection-filter/dist/index.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

declare global {
  namespace Grafast {
    interface Context {
      mol?: number;
    }
  }
}

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
          gql: Int
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
          gql: {
            resolve: EXPORTABLE(
              () =>
                function resolve(e) {
                  return e;
                },
              [],
            ),
            subscribe: EXPORTABLE(
              (sleep) =>
                async function* subscribe() {
                  for (let i = 0; i < 10; i++) {
                    yield i;
                    await sleep(300);
                  }
                },
              [sleep],
            ),
          },
        },
      },
    }),
    // PrimaryKeyMutationsOnlyPlugin,
    PersistedPlugin,
  ],
  extends: [
    postgraphilePresetAmber,
    makeV4Preset({
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
      dynamicJson: true,
      graphiql: true,
      graphiqlRoute: "/",
    }),
    PgManyToManyPreset,
    PostGraphileConnectionFilterPreset,
  ],
  inflection: {},
  gather: {},
  schema: {
    retryOnInitFail: true,
    exportSchemaSDLPath: `${__dirname}/latestSchema.graphql`,
    exportSchemaIntrospectionResultPath: `${__dirname}/latestSchema.json`,
    sortExport: true,
  },
  grafserv: {
    graphqlPath: "/v2/graphql",
    websockets: true,
    graphqlOverGET: true,
    persistedOperationsDirectory: `${process.cwd()}/.persisted_operations`,
    allowUnpersistedOperation: true,
  },
  grafast: {
    context: {
      mol: 42,
    },
  },
  pgServices: [
    makePgService({
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
