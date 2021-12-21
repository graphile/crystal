import "graphile-build";
import "./PgTablesPlugin";
import "../interfaces";

import type {
  PgSelectSinglePlan,
  PgSource,
  PgSourceColumn,
  PgTypeCodec,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import sql from "pg-sql2";

import { getBehavior } from "../behaviour";
import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      /**
       * Given a columnName on a PgTypeCodec's columns, should return the field
       * name to use to represent this column (both for input and output).
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behaviour.
       */
      _columnName(
        this: GraphileEngine.Inflection,
        details: {
          columnName: string;
          column: PgSourceColumn;
          codec: PgTypeCodec<any, any, any>;
          skipRowId?: boolean;
        },
      ): string;

      /**
       * The field name for a given column on that pg_class' table type. May
       * also be used in other places (e.g. the Input or Patch type associated
       * with the table).
       */
      column(
        this: GraphileEngine.Inflection,
        details: {
          columnName: string;
          column: PgSourceColumn;
          codec: PgTypeCodec<any, any, any>;
        },
      ): string;
    }
  }
}

export const PgColumnsPlugin: Plugin = {
  name: "PgColumnsPlugin",
  description: "Adds columns to composite types",
  version: version,
  // TODO: Requires PgTablesPlugin
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend<
          typeof inflection,
          Partial<GraphileEngine.Inflection>
        >(
          inflection,
          {
            _columnName({ columnName, column }) {
              return this.coerceToGraphQLName(
                column.extensions?.tags?.name || columnName,
              );
            },
            column(details) {
              return this.camelCase(this._columnName(details));
            },
          },
          "Adding inflectors from PgColumnsPlugin",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          graphql: { getNullableType, GraphQLNonNull },
          inflection,
          getGraphQLTypeByPgCodec,
        } = build;
        const {
          scope: { pgCodec, isPgTableType },
        } = context;

        if (!isPgTableType || !pgCodec?.columns) {
          return fields;
        }

        for (const columnName in pgCodec.columns) {
          const column = pgCodec.columns[columnName];

          const behavior = getBehavior(column.extensions);
          if (behavior && !behavior.includes("select")) {
            // Don't allow selecting this column.
            continue;
          }

          const columnFieldName = inflection.column({
            columnName,
            column,
            codec: pgCodec,
          });
          const baseType = getGraphQLTypeByPgCodec(column.codec, "output");
          if (!baseType) {
            console.warn(
              `Couldn't find a 'output' variant for ${
                sql.compile(pgCodec.sqlType).text
              }'s '${columnName}' column (${
                sql.compile(column.codec.sqlType).text
              })`,
            );
            continue;
          }
          const type = column.notNull
            ? new GraphQLNonNull(getNullableType(baseType))
            : baseType;

          if (!type) {
            // Could not determine the type, skip this field
            console.warn(
              `Could not determine the type for column '${columnName}' of ${
                sql.compile(pgCodec.sqlType).text
              }`,
            );
            continue;
          }

          fields = extend(
            fields,
            {
              [columnFieldName]: {
                type,
                plan: EXPORTABLE(
                  (columnName) =>
                    ($record: PgSelectSinglePlan<any, any, any, any>) =>
                      $record.get(columnName),
                  [columnName],
                ),
              },
            },
            `Adding '${columnName}' column field for codec representing ${
              sql.compile(pgCodec.sqlType).text
            }`,
          );
        }
        return fields;
      },
    },
  },
};
