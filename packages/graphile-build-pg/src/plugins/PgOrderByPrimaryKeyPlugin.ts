import "./PgTablesPlugin";
import "graphile-config";

import type { PgSelectPlan, PgSourceUnique } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";

import { version } from "../index";

export const PgOrderByPrimaryKeyPlugin: GraphileConfig.Plugin = {
  name: "PgOrderByPrimaryKeyPlugin",
  description: "Adds ordering by the table's primary key",
  version: version,

  schema: {
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { extend, inflection, sql } = build;
        const {
          scope: { isPgRowSortEnum, pgCodec },
        } = context;

        if (
          !isPgRowSortEnum ||
          !pgCodec ||
          !pgCodec.columns ||
          pgCodec.isAnonymous
        ) {
          return values;
        }

        const sources = build.input.pgSources.filter(
          (s) => s.codec === pgCodec && !s.parameters,
        );
        if (sources.length < 1) {
          return values;
        }

        const primaryKey = (sources[0].uniques as PgSourceUnique[]).find(
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
                  plan: EXPORTABLE(
                    (pgCodec, primaryKeyColumns, sql) =>
                      (plan: PgSelectPlan<any, any, any, any>) => {
                        primaryKeyColumns.forEach((columnName) => {
                          const column = pgCodec.columns[columnName];
                          plan.orderBy({
                            codec: column.codec,
                            fragment: sql`${plan.alias}.${sql.identifier(
                              columnName,
                            )}`,
                            direction: "ASC",
                          });
                        });
                        plan.setOrderIsUnique();
                      },
                    [pgCodec, primaryKeyColumns, sql],
                  ),
                },
              },
            },
            [inflection.builtin("PRIMARY_KEY_DESC")]: {
              extensions: {
                graphile: {
                  plan: EXPORTABLE(
                    (pgCodec, primaryKeyColumns, sql) =>
                      (plan: PgSelectPlan<any, any, any, any>) => {
                        primaryKeyColumns.forEach((columnName) => {
                          const column = pgCodec.columns[columnName];
                          plan.orderBy({
                            codec: column.codec,
                            fragment: sql`${plan.alias}.${sql.identifier(
                              columnName,
                            )}`,
                            direction: "DESC",
                          });
                        });
                        plan.setOrderIsUnique();
                      },
                    [pgCodec, primaryKeyColumns, sql],
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
