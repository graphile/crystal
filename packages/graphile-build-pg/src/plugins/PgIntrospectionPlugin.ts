import "graphile-build";

import type { WithPgClient } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";

import { version } from "../index";
import type { Introspection } from "../introspection";
import { makeIntrospectionQuery } from "../introspection";

declare module "graphile-plugin" {
  interface GatherHelpers {
    pg: {
      getIntrospection(): Promise<Introspection>;
    };
  }
  interface GatherOptions {
    pgDatabases: ReadonlyArray<{
      name: string;
      withClient: WithPgClient;
      listen(topic: string): AsyncIterable<string>;
    }>;
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
      getIntrospection(opts) {
        let introspectionPromise = opts.cache.introspectionResultsPromise;
        if (!introspectionPromise) {
          introspectionPromise = opts.cache.introspectionResultsPromise =
            Promise.all(
              opts.options.pgDatabases.map(async (database) => {
                const introspectionQuery = makeIntrospectionQuery();
                console.log(introspectionQuery);
                const {
                  rows: [introspection],
                } = await database.withClient(null, (client) =>
                  client.query<{ introspection: Introspection }>({
                    text: introspectionQuery,
                  }),
                );
                return { database, introspection };
              }),
            );
        }
        return introspectionPromise;
      },
    },
  },
};
