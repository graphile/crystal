import "graphile-build";
import "./PgTablesPlugin";
import "../interfaces";

import type {
  PgSelectSinglePlan,
  PgSourceColumn,
  PgTypeCodec,
} from "@dataplan/pg";
import {
  pgSelectFromRecords,
  pgSelectSingleFromRecord,
  PgSource,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import sql from "pg-sql2";

import { getBehavior } from "../behavior";
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
       * them common behavior.
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

function unwrapCodec(
  codec: PgTypeCodec<any, any, any, any>,
): PgTypeCodec<any, any, any, any> {
  if (codec.arrayOfCodec) {
    return unwrapCodec(codec.arrayOfCodec);
  }
  return codec;
}

export const PgColumnsPlugin: Plugin = {
  name: "PgColumnsPlugin",
  description: "Adds columns to composite types",
  version: version,
  // TODO: Requires PgTablesPlugin

  inflection: {
    add: {
      _columnName(options, { columnName, column }) {
        return this.coerceToGraphQLName(
          column.extensions?.tags?.name || columnName,
        );
      },
      column(options, details) {
        return this.camelCase(this._columnName(details));
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          graphql: { getNullableType, GraphQLNonNull, GraphQLList },
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

          const behavior = getBehavior(column.extensions) ?? ["select"];
          if (!behavior.includes("select")) {
            // Don't allow selecting this column.
            continue;
          }

          const columnFieldName = inflection.column({
            columnName,
            column,
            codec: pgCodec,
          });
          const baseCodec = unwrapCodec(column.codec);
          const baseType = getGraphQLTypeByPgCodec(baseCodec, "output")!;
          const arrayOrNotType = column.codec.arrayOfCodec
            ? new GraphQLList(
                baseType, // TODO: nullability
              )
            : baseType;
          if (!arrayOrNotType) {
            console.warn(
              `Couldn't find a 'output' variant for PgTypeCodec ${
                pgCodec.name
              }'s '${columnName}' column (${column.codec.name}; array=${!!column
                .codec.arrayOfCodec}, domain=${!!column.codec
                .domainOfCodec}, enum=${!!(column.codec as any).values})`,
            );
            continue;
          }
          const type = column.notNull
            ? new GraphQLNonNull(getNullableType(arrayOrNotType))
            : arrayOrNotType;

          if (!type) {
            // Could not determine the type, skip this field
            console.warn(
              `Could not determine the type for column '${columnName}' of ${pgCodec.name}`,
            );
            continue;
          }

          const makePlan = () => {
            // See if there's a source to pull record types from (e.g. for relations/etc)
            if (!baseCodec.columns) {
              // Simply get the value
              return EXPORTABLE(
                (columnName) =>
                  ($record: PgSelectSinglePlan<any, any, any, any>) => {
                    if (!$record.get) {
                      console.log(
                        `Unexpected plan ${$record} - expected a plan with a '.get' method`,
                      );
                    }
                    return $record.get(columnName);
                  },
                [columnName],
              );
            } else {
              const pgSources = build.input.pgSources;
              const getSource = EXPORTABLE(
                (PgSource, baseCodec, pgSources) =>
                  ($record: PgSelectSinglePlan<any, any, any, any>) => {
                    const executor = $record.source.executor;
                    const source =
                      pgSources.find(
                        (potentialSource) =>
                          potentialSource.codec === baseCodec &&
                          !potentialSource.parameters &&
                          potentialSource.executor === executor,
                      ) ?? PgSource.fromCodec(executor, baseCodec);
                    return source;
                  },
                [PgSource, baseCodec, pgSources],
              );
              if (!column.codec.arrayOfCodec) {
                // Single record from source
                /*
                 * TODO: if we refactor `PgSelectSinglePlan` we can probably
                 * optimise this to do inline selection and still join against
                 * the base table using e.g. `(table.column).attribute =
                 * joined_thing.column`
                 */
                return EXPORTABLE(
                  (columnName, getSource, pgSelectSingleFromRecord) =>
                    ($record: PgSelectSinglePlan<any, any, any, any>) => {
                      const $plan = $record.get(columnName);
                      const $select = pgSelectSingleFromRecord(
                        getSource($record),
                        $plan,
                      );
                      $select.getClassPlan().setTrusted();
                      return $select;
                    },
                  [columnName, getSource, pgSelectSingleFromRecord],
                );
              } else {
                // Many records from source
                /*
                 * TODO: if we refactor `PgSelectSinglePlan` we can probably
                 * optimise this to do inline selection and still join against
                 * the base table using e.g. `(table.column).attribute =
                 * joined_thing.column`
                 */
                return EXPORTABLE(
                  (columnName, getSource, pgSelectFromRecords) =>
                    ($record: PgSelectSinglePlan<any, any, any, any>) => {
                      const $plan = $record.get(columnName);
                      const $select = pgSelectFromRecords(
                        getSource($record),
                        $plan,
                      );
                      $select.setTrusted();
                      return $select;
                    },
                  [columnName, getSource, pgSelectFromRecords],
                );
              }
            }
          };

          fields = extend(
            fields,
            {
              [columnFieldName]: {
                type,
                plan: makePlan(),
              },
            },
            `Adding '${columnName}' column field for PgTypeCodec ${pgCodec.name}`,
          );
        }
        return fields;
      },
    },
  },
};
