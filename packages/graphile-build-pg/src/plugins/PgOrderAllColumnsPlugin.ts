import "./PgTablesPlugin";
import "graphile-config";

import type {
  PgSelectPlan,
  PgSourceUnique,
  PgTypeCodec,
  PgTypeColumn,
  PgTypeColumns,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";

import { getBehavior } from "../behavior";
import { version } from "../index";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      orderByColumnEnum(
        this: Inflection,
        details: {
          codec: PgTypeCodec<any, any, any, any>;
          columnName: string;
          column: PgTypeColumn;
          variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
        },
      ): string;
    }
  }
}

// TODO: respect indexes - via behavior?
export const PgOrderAllColumnsPlugin: GraphileConfig.Plugin = {
  name: "PgOrderAllColumnsPlugin",
  description: "Allows ordering by table columns",
  version: version,

  inflection: {
    add: {
      orderByColumnEnum(options, { columnName, variant }) {
        return this.constantCase(`${columnName}-${variant}`);
      },
    },
  },

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
        const columns = pgCodec.columns as PgTypeColumns;
        const sources = build.input.pgSources.filter(
          (s) => s.codec === pgCodec && !s.parameters,
        );
        const uniques = sources.flatMap((s) => s.uniques as PgSourceUnique[]);
        return extend(
          values,
          Object.entries(columns).reduce((memo, [columnName, column]) => {
            const behavior = getBehavior([
              pgCodec.extensions,
              column.extensions,
            ]);
            // Enable ordering, but don't order by array or range types
            const defaultBehavior =
              "orderBy orderBy:* -orderBy:array -orderBy:range";
            if (
              !build.behavior.matches(
                behavior,
                "attribute:orderBy",
                defaultBehavior,
              )
            ) {
              return memo;
            }
            if (column.codec.arrayOfCodec) {
              if (
                !build.behavior.matches(
                  behavior,
                  "attribute:orderBy:array",
                  defaultBehavior,
                )
              ) {
                return memo;
              }
            }
            if (column.codec.rangeOfCodec) {
              if (
                !build.behavior.matches(
                  behavior,
                  "attribute:orderBy:range",
                  defaultBehavior,
                )
              ) {
                return memo;
              }
            }
            const isUnique = uniques.some(
              (list) => list.columns[0] === columnName,
            );

            const ascFieldName = inflection.orderByColumnEnum({
              column,
              codec: pgCodec,
              columnName,
              variant: "asc",
            });
            const descFieldName = inflection.orderByColumnEnum({
              column,
              codec: pgCodec,
              columnName,
              variant: "desc",
            });
            memo = extend(
              memo,
              {
                [ascFieldName]: {
                  extensions: {
                    graphile: {
                      plan: EXPORTABLE(
                        (column, columnName, isUnique, sql) =>
                          (plan: PgSelectPlan<any, any, any, any>) => {
                            plan.orderBy({
                              codec: column.codec,
                              fragment: sql`${plan.alias}.${sql.identifier(
                                columnName,
                              )}`,
                              direction: "ASC",
                            });
                            if (isUnique) {
                              plan.setOrderIsUnique();
                            }
                          },
                        [column, columnName, isUnique, sql],
                      ),
                    },
                  },
                },
              },
              `Adding ascending orderBy enum value for ${pgCodec.name}.`,
              // TODO
              /* `You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                column,
                {
                  name: "newNameHere",
                },
              )}`,*/
            );
            memo = extend(
              memo,
              {
                [descFieldName]: {
                  extensions: {
                    graphile: {
                      plan: EXPORTABLE(
                        (column, columnName, isUnique, sql) =>
                          (plan: PgSelectPlan<any, any, any, any>) => {
                            plan.orderBy({
                              codec: column.codec,
                              fragment: sql`${plan.alias}.${sql.identifier(
                                columnName,
                              )}`,
                              direction: "DESC",
                            });
                            if (isUnique) {
                              plan.setOrderIsUnique();
                            }
                          },
                        [column, columnName, isUnique, sql],
                      ),
                    },
                  },
                },
              },
              `Adding descending orderBy enum value for ${pgCodec.name}.`,
              // TODO
              /* `You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                column,
                {
                  name: "newNameHere",
                },
              )}`,*/
            );
            return memo;
          }, {}),
          `Adding order values from table '${pgCodec.name}'`,
        );
      },
    },
  },
};
