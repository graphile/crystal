import "graphile-build";

import type { WithPgClient } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";

import { version } from "../index";
import type { Introspection } from "../introspection";
import { makeIntrospectionQuery } from "../introspection";

declare global {
  namespace GraphileEngine {
    interface GraphileBuildGatherOptions {
      pgDatabases: ReadonlyArray<{
        name: string;
        withClient: WithPgClient;
        listen?(topic: string): AsyncIterable<string>;
      }>;
    }
  }
}

declare module "graphile-plugin" {
  interface GatherHelpers {
    pg: {
      getIntrospection(): Promise<Introspection>;
    };
  }
}

interface Cache {
  introspectionResultsPromise: null | Promise<Introspection>;
}

export const PgIntrospectionPlugin: Plugin = {
  name: "PgIntrospectionPlugin",
  description:
    "Introspects PostgreSQL databases and makes the results available to other plugins",
  version: version,
  gather: {
    namespace: "pg",
    initialCache: (): Cache => ({
      introspectionResultsPromise: null,
    }),
    helpers: {
      getIntrospection(info) {
        let introspectionPromise = info.cache.introspectionResultsPromise;
        if (!introspectionPromise) {
          introspectionPromise = info.cache.introspectionResultsPromise =
            Promise.all(
              info.options.pgDatabases.map(async (database) => {
                const introspectionQuery = makeIntrospectionQuery();
                const {
                  rows: [row],
                } = await database.withClient(null, (client) =>
                  client.query<{ introspection: string }>({
                    text: introspectionQuery,
                  }),
                );
                if (!row) {
                  throw new Error("Introspection failed");
                }
                const introspection = JSON.parse(
                  row.introspection,
                ) as Introspection;
                return { database, introspection };
              }),
            );
        }
        return introspectionPromise;
      },
    },
  },
};
