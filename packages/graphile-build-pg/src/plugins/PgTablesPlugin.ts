import "graphile-build";

import type { PgSource, PgSourceColumns } from "@dataplan/pg";
import { PgSourceBuilder, recordType } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";
import sql from "pg-sql2";

import { version } from "../index";
import type { PgTypeCodec } from "../interfaces";
import type { PgClass } from "../introspection";

declare global {
  namespace GraphileEngine {
    interface BuildInput {
      pgSources: PgSource<any, any, any, any>[];
    }
  }
}

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
      }) => Promise<void>
    >;
  }
}

interface State {
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
      sources: [],
    }),
    hooks: {
      async "pgIntrospection:class"({ state, helpers }, event) {
        const { entity: klass, databaseName } = event;
        if (
          ["r", "v", "m", "p"].includes(klass.relkind) &&
          !klass.relispartition
        ) {
          const namespace = await helpers.pgIntrospection.getNamespace(
            event.databaseName,
            klass.relnamespace,
          );
          if (!namespace) {
            throw new Error(
              `Could not retrieve namespace for table '${klass._id}'`,
            );
          }
          const sqlIdentifier = sql.identifier(
            namespace.nspname,
            klass.relname,
          );
          const columns = {};
          const name = `${event.databaseName}.${namespace.nspname}.${klass.relname}`;
          const executor =
            helpers.pgIntrospection.getExecutorForDatabase(databaseName);
          const codec = recordType(sqlIdentifier, columns);
          const source = EXPORTABLE(
            (PgSourceBuilder, codec, executor, name, sqlIdentifier) =>
              new PgSourceBuilder({
                executor,
                name,
                source: sqlIdentifier,
                codec,
              }),
            [PgSourceBuilder, codec, executor, name, sqlIdentifier],
          );
          state.sources.push(source);
        }
      },
    },
    async main(output, info) {
      if (!output.pgSources) {
        output.pgSources = [];
      }
      output.pgSources!.push(...info.state.sources);
    },
  } as PluginGatherConfig<"pgTables">,
};
