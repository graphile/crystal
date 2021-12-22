import "graphile-build";

import type { PgSelectPlan, PgSource, PgTypeCodec } from "@dataplan/pg";
import { PgSelectSinglePlan, PgSourceBuilder, recordType } from "@dataplan/pg";
import { ConnectionPlan } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";
import type { GraphQLOutputType } from "graphql";
import sql from "pg-sql2";

import { getBehavior } from "../behaviour";
import { version } from "../index";
import type { PgClass } from "../introspection";

declare global {
  namespace GraphileEngine {
    interface GraphileBuildSchemaOptions {
      /**
       * If true, setof functions cannot return null, so our list and
       * connection types can use GraphQLNonNull in more places.
       */
      pgForbidSetofFunctionsToReturnNull?: boolean;
    }

    interface BuildInput {
      pgSources: PgSource<any, any, any>[];
    }

    interface Inflection {
      /**
       * A PgTypeCodec may represent any of a wide range of PostgreSQL types;
       * this inflector gives a name to this codec, it's primarily used when
       * naming _types_ in the GraphQL schema (as opposed to `_sourceName`
       * which typically names _fields_).
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

    interface ScopeGraphQLObjectType {
      pgCodec?: PgTypeCodec<any, any, any>;
      isPgTableType?: boolean;
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
          const codec = EXPORTABLE(
            (columns, recordType, sqlIdentifier) =>
              recordType(sqlIdentifier, columns),
            [columns, recordType, sqlIdentifier],
          );
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
        const {
          getOutputTypeByName,
          graphql: { GraphQLNonNull, GraphQLList },
          inflection,
          options: { pgForbidSetofFunctionsToReturnNull },
        } = build;
        const nullableIf = (condition: boolean, Type: GraphQLOutputType) =>
          condition ? Type : new GraphQLNonNull(Type);
        for (const codec of build.pgCodecMetaLookup.keys()) {
          if (!codec.columns) {
            // Only apply to codecs that define columns
            continue;
          }

          const behavior = getBehavior(codec.extensions);
          // TODO: is 'selectable' the right behavior? What if you can only see
          // it in a subscription? What if only on a mutation payload? More
          // like "viewable"?
          if (behavior && !behavior.includes("selectable")) {
            continue;
          }
          const codecName = sql.compile(codec.sqlType).text;

          const tableTypeName = build.inflection.tableType(codec);
          build.registerObjectType(
            tableTypeName,
            {
              pgCodec: codec,
              isPgTableType: true,
            },
            null,
            () => ({}),
            `PgTablesPlugin table type for ${codecName}`,
          );

          if (!behavior || behavior.includes("connection")) {
            // Register edges
            const edgeTypeName = build.inflection.edgeType(tableTypeName);
            build.registerObjectType(
              edgeTypeName,
              {},
              PgSelectSinglePlan,
              () => ({
                description: build.wrapDescription(
                  `A \`${tableTypeName}\` edge in the connection.`,
                  "type",
                ),
                fields: ({ fieldWithHooks }) => {
                  const Cursor = getOutputTypeByName(
                    inflection.builtin("Cursor"),
                  );
                  const TableType = getOutputTypeByName(tableTypeName);

                  return {
                    cursor: fieldWithHooks(
                      {
                        fieldName: "cursor",
                        isCursorField: true,
                      },
                      () => ({
                        description: build.wrapDescription(
                          "A cursor for use in pagination.",
                          "field",
                        ),
                        type: Cursor,
                        plan: EXPORTABLE(
                          () =>
                            function plan(
                              $record: PgSelectSinglePlan<any, any, any, any>,
                            ) {
                              return $record.cursor();
                            },
                          [],
                        ),
                      }),
                    ),
                    node: fieldWithHooks(
                      {
                        fieldName: "node",
                      },
                      () => ({
                        description: build.wrapDescription(
                          `The \`${tableTypeName}\` at the end of the edge.`,
                          "field",
                        ),
                        type: nullableIf(
                          !pgForbidSetofFunctionsToReturnNull,
                          TableType,
                        ),
                        plan: EXPORTABLE(
                          () =>
                            function plan(
                              $record: PgSelectSinglePlan<any, any, any, any>,
                            ) {
                              return $record;
                            },
                          [],
                        ),
                      }),
                    ),
                  };
                },
              }),
              `PgTablesPlugin edge type for ${codecName}`,
            );

            // Register connection
            const connectionTypeName =
              build.inflection.connectionType(tableTypeName);
            build.registerObjectType<
              ConnectionPlan<PgSelectPlan<any, any, any, any>>
            >(
              connectionTypeName,
              {},
              ConnectionPlan,
              () => {
                const TableType = getOutputTypeByName(tableTypeName);
                const EdgeType = getOutputTypeByName(
                  build.inflection.edgeType(tableTypeName),
                );
                const PageInfo = getOutputTypeByName(
                  build.inflection.builtin("PageInfo"),
                );
                return {
                  description: build.wrapDescription(
                    `A connection to a list of \`${tableTypeName}\` values.`,
                    "type",
                  ),
                  fields: ({ fieldWithHooks }) => ({
                    nodes: fieldWithHooks(
                      {
                        fieldName: "nodes",
                      },
                      () => ({
                        description: build.wrapDescription(
                          `A list of \`${tableTypeName}\` objects.`,
                          "field",
                        ),
                        type: new GraphQLNonNull(
                          new GraphQLList(
                            nullableIf(
                              !pgForbidSetofFunctionsToReturnNull,
                              TableType,
                            ),
                          ),
                        ),
                        plan: EXPORTABLE(
                          () =>
                            function plan(
                              $connection: ConnectionPlan<
                                PgSelectPlan<any, any, any, any>
                              >,
                            ) {
                              return $connection.nodes();
                            },
                          [],
                        ),
                      }),
                    ),
                    edges: fieldWithHooks(
                      {
                        fieldName: "edges",
                      },
                      () => ({
                        description: build.wrapDescription(
                          `A list of edges which contains the \`${tableTypeName}\` and cursor to aid in pagination.`,
                          "field",
                        ),
                        type: new GraphQLNonNull(
                          new GraphQLList(new GraphQLNonNull(EdgeType)),
                        ),
                        plan: EXPORTABLE(
                          () =>
                            function plan(
                              $connection: ConnectionPlan<
                                PgSelectPlan<any, any, any, any>
                              >,
                            ) {
                              return $connection.nodes();
                            },
                          [],
                        ),
                      }),
                    ),
                    pageInfo: fieldWithHooks(
                      {
                        fieldName: "pageInfo",
                      },
                      () => ({
                        description: build.wrapDescription(
                          "Information to aid in pagination.",
                          "field",
                        ),
                        type: new GraphQLNonNull(PageInfo),
                        plan: EXPORTABLE(
                          () =>
                            function plan(
                              $connection: ConnectionPlan<
                                PgSelectPlan<any, any, any, any>
                              >,
                            ) {
                              // TODO: why is this a TypeScript issue without the 'any'?
                              return $connection.pageInfo() as any;
                            },
                          [],
                        ),
                      }),
                    ),
                  }),
                };
              },
              `PgTablesPlugin connection type for ${codecName}`,
            );
          }
        }
        return _;
      },
    },
  },
};
