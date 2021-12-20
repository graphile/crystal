import "graphile-build";

import type { PgSource, PgTypeCodec } from "@dataplan/pg";
import { PgSourceBuilder, recordType } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";
import sql from "pg-sql2";

import { uniq } from "../_";
import { version } from "../index";
import type { PgClass } from "../introspection";
import { getBehavior } from "../behaviour";

declare global {
  namespace GraphileEngine {
    interface BuildInput {
      pgSources: PgSource<any, any, any>[];
    }

    interface Inflection {
      /**
       * A PgTypeCodec may represent any of a wide range of PostgreSQL types;
       * this inflector gives a name to this codec, it's primarily used when
       * naming _types_ in the GraphQL schema (as opposed to `_sourceName`
       * which typically names _fields.
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behaviour.
       */
      _codecName(this: Inflection, codec: PgTypeCodec<any, any, any>): string;

      /**
       * Takes a `_codecName` and singularizes it. This is also a good place to
       * try and avoid potential conflicts, e.g. for a table `foo` a `Foo` and
       * `FooInput` and `FooPatch` type might be generated. So a `foo_input`
       * table could potentially cause conflicts. The default inflector would
       * turn `foo_input` into `FooInputRecord`.
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behaviour.
       */
      _singularizedCodecName(
        this: Inflection,
        codec: PgTypeCodec<any, any, any>,
      ): string;

      /**
       * The name of the GraphQL Object Type that's generated to represent a
       * specific table (more specifically a PostgreSQL "pg_class" which is
       * represented as a certain PgTypeCodec)
       */
      tableType(
        this: GraphileEngine.Inflection,
        codec: PgTypeCodec<any, any, any>,
      ): string;
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
  sources: PgSource<any, any, any>[];
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

  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend<
          typeof inflection,
          Partial<GraphileEngine.Inflection>
        >(
          inflection,
          {
            _codecName(codec) {
              return this.coerceToGraphQLName(
                codec.extensions?.tags?.name || sql.compile(codec.sqlType).text,
              );
            },

            _singularizedCodecName(codec) {
              return this.singularize(this._codecName(codec)).replace(
                /.(?:(?:[_-]i|I)nput|(?:[_-]p|P)atch)$/,
                "$&_record",
              );
            },

            tableType(codec) {
              return this.upperCamelCase(this._singularizedCodecName(codec));
            },
          },
          "Adding inflectors for PgTablesPlugin",
        );
      },

      init(_, build, _context) {
        const codecs = uniq(build.input.pgSources.map((s) => s.codec));
        codecs.forEach((codec) => {
          if (!codec.columns) {
            // Only apply to codecs that define columns
            return;
          }

          const behavior = getBehavior(codec.extensions);
          // TODO: is 'selectable' the right behavior? What if you can only see
          // it in a subscription? What if only on a mutation payload? More
          // like "viewable"?
          if (behavior && !behavior.includes("selectable")) {
            return;
          }

          build.registerObjectType(
            build.inflection.tableType(codec),
            {},
            null,
            () => ({
              fields: {
                k: {
                  type: build.graphql.GraphQLString,
                },
              },
            }),
            "PgTablesPlugin",
          );
        });
        return _;
      },
    },
  },
};
