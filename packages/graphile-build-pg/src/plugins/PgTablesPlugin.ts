import "graphile-build";

import type { PgSource } from "@dataplan/pg";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";

import { version } from "../index";
import type { PgClass } from "../introspection";

declare module "graphile-plugin" {
  interface GatherHelpers {
    pgTables: Record<string, never>;
  }

  interface GatherHooks {
    "pgTables:PgSource": PluginHook<
      (event: {
        source: PgSource<any, any, any, any>;
        pgClass: PgClass;
        databaseName: string;
      }) => Promise<PgSource<any, any, any, any>>
    >;
  }
}

interface State {
  tables: PgClass[];
  sources: PgSource<any, any, any, any>[];
}

export const PgTablesPlugin: Plugin = {
  name: "PgTablesPlugin",
  description:
    "Spots pg_class entries that looks like tables/views/materialized views (but not partitions!) and registers them as sources",
  version: version,
  gather: {
    namespace: "pgTables",
    helpers: {},
    initialState: (): State => ({
      tables: [],
      sources: [],
    }),
    hooks: {
      "pgIntrospection:class"({ state }, event) {
        console.log(event.entity);
        if (
          ["r", "v", "m", "p"].includes(event.entity.relkind) &&
          !event.entity.relispartition
        ) {
          state.tables.push(event.entity);
        }
        return event;
      },
    },
    async main(output: any, context, _helpers) {
      if (!output.pgSources) {
        output.pgSources = [];
      }
      output.pgSources!.push(...context.state.sources);
    },
  } as PluginGatherConfig<"pgTables">,
};
