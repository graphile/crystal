import "graphile-build";
import "./PgTablesPlugin";

import type { PgSelectSinglePlan, PgSource } from "@dataplan/pg";
import { connection } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLObjectType, GraphQLOutputType } from "graphql";

import { getBehavior } from "../behavior";
import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      /**
       * A PgSource represents a single way of getting a number of values of
       * `source.codec` type. It doesn't necessarily represent a table directly
       * (although it can) - e.g. it might be a function that returns records
       * from a table, or it could be a "sub-selection" of a table, e.g.
       * "admin_users" might be "users where admin is true".  This inflector
       * gives a name to this source, it's primarily used when naming _fields_
       * in the GraphQL schema (as opposed to `_codecName` which typically
       * names _types_.
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _sourceName(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;

      /**
       * Takes a `_sourceName` and singularizes it.
       */
      _singularizedSourceName(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;

      /**
       * The field name for a Cursor Connection field that returns all rows
       * from the given source.
       */
      allRowsConnection(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;

      /**
       * The field name for a List field that returns all rows from the given
       * source.
       */
      allRowsList(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;
    }
  }
}

export const PgAllRowsPlugin: Plugin = {
  name: "PgAllRowsPlugin",
  description: "Adds 'all rows' accessors for all tables.",
  version: version,
  // TODO: Requires PgTablesPlugin

  inflection: {
    add: {
      _sourceName(options, source) {
        return this.coerceToGraphQLName(
          source.extensions?.tags?.name || source.name,
        );
      },

      _singularizedSourceName(options, source) {
        return this.singularize(this._sourceName(source));
      },

      allRowsConnection(options, source) {
        return this.camelCase(
          `all-${this.pluralize(this._singularizedSourceName(source))}`,
        );
      },
      allRowsList(options, source) {
        return this.camelCase(
          `all-${this.pluralize(this._singularizedSourceName(source))}-list`,
        );
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: { GraphQLList, GraphQLNonNull },
          getOutputTypeByName,
        } = build;
        const { fieldWithHooks } = context;
        if (!context.scope.isRootQuery) {
          return fields;
        }
        for (const source of build.input.pgSources) {
          if (source.parameters) {
            // Skip functions
            continue;
          }
          if (!source.find) {
            continue;
          }
          const type = build.getTypeByName(
            build.inflection.tableType(source.codec),
          );
          if (!type) {
            continue;
          }

          const behavior = getBehavior(source.extensions);
          // TODO: should this be `"all:list"`?
          if (behavior && !behavior.includes("all")) {
            continue;
          }

          {
            const fieldName = build.inflection.allRowsList(source);
            fields = build.extend(
              fields,
              {
                [fieldName]: fieldWithHooks(
                  {
                    fieldName,
                    isPgFieldSimpleCollection: true,
                    pgSource: source,
                  },
                  () => ({
                    type: new GraphQLList(
                      new GraphQLNonNull(type),
                    ) as GraphQLOutputType,
                    plan: EXPORTABLE(
                      (source) =>
                        function plan() {
                          return source.find();
                        },
                      [source],
                    ),
                  }),
                ),
              },
              `Adding 'all rows' list field for PgSource ${source}`,
            );
          }

          {
            const fieldName = build.inflection.allRowsConnection(source);
            const connectionType = build.getTypeByName(
              build.inflection.connectionType(
                build.inflection.tableType(source.codec),
              ),
            ) as GraphQLObjectType | undefined;
            if (connectionType) {
              fields = build.extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      isPgFieldConnection: true,
                      pgSource: source,
                    },
                    () => ({
                      type: connectionType,
                      plan: EXPORTABLE(
                        (connection, source) =>
                          function plan() {
                            return connection(
                              source.find(),
                              ($item) => $item,
                              ($item: PgSelectSinglePlan<any, any, any, any>) =>
                                $item.cursor(),
                            );
                          },
                        [connection, source],
                      ),
                    }),
                  ),
                },
                `Adding 'all rows' connection field for PgSource ${source}`,
              );
            }
          }
        }
        return fields;
      },
    },
  },
};