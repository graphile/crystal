import "./PgTablesPlugin.js";
import "graphile-config";

import type { PgSelectStep, PgResourceUnique } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      // TODO: rename to `pgOrderByNullsLast`?
      orderByNullsLast?: boolean;
    }
  }
}

export const PgOrderByPrimaryKeyPlugin: GraphileConfig.Plugin = {
  name: "PgOrderByPrimaryKeyPlugin",
  description: "Adds ordering by the table's primary key",
  version: version,

  schema: {
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { extend, inflection, sql, options } = build;
        const {
          scope: { isPgRowSortEnum, pgCodec },
        } = context;
        const { orderByNullsLast } = options;

        if (
          !isPgRowSortEnum ||
          !pgCodec ||
          !pgCodec.columns ||
          pgCodec.isAnonymous
        ) {
          return values;
        }

        const sources = Object.values(build.input.pgRegistry.pgSources).filter(
          (s) => s.codec === pgCodec && !s.parameters,
        );
        if (sources.length < 1) {
          return values;
        }

        const primaryKey = (sources[0].uniques as PgResourceUnique[]).find(
          (source) => source.isPrimary,
        );
        if (!primaryKey) {
          return values;
        }
        const primaryKeyColumns = primaryKey.columns as string[];

        return extend(
          values,
          {
            [inflection.builtin("PRIMARY_KEY_ASC")]: {
              extensions: {
                graphile: {
                  applyPlan: EXPORTABLE(
                    (orderByNullsLast, pgCodec, primaryKeyColumns, sql) =>
                      (step: PgSelectStep<any>) => {
                        primaryKeyColumns.forEach((columnName) => {
                          const column = pgCodec.columns[columnName];
                          step.orderBy({
                            codec: column.codec,
                            fragment: sql`${step.alias}.${sql.identifier(
                              columnName,
                            )}`,
                            direction: "ASC",
                            ...(orderByNullsLast != null
                              ? {
                                  nulls: orderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        step.setOrderIsUnique();
                      },
                    [orderByNullsLast, pgCodec, primaryKeyColumns, sql],
                  ),
                },
              },
            },
            [inflection.builtin("PRIMARY_KEY_DESC")]: {
              extensions: {
                graphile: {
                  applyPlan: EXPORTABLE(
                    (orderByNullsLast, pgCodec, primaryKeyColumns, sql) =>
                      (step: PgSelectStep<any>) => {
                        primaryKeyColumns.forEach((columnName) => {
                          const column = pgCodec.columns[columnName];
                          step.orderBy({
                            codec: column.codec,
                            fragment: sql`${step.alias}.${sql.identifier(
                              columnName,
                            )}`,
                            direction: "DESC",
                            ...(orderByNullsLast != null
                              ? {
                                  nulls: orderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        step.setOrderIsUnique();
                      },
                    [orderByNullsLast, pgCodec, primaryKeyColumns, sql],
                  ),
                },
              },
            },
          },
          `Adding primary key asc/desc sort to table '${pgCodec.name}'`,
        );
      },
    },
  },
};
