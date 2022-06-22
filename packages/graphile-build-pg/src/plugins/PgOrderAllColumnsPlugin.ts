import "./PgTablesPlugin.js";
import "graphile-config";

import {
  PgSelectPlan,
  PgSourceUnique,
  PgTypeCodec,
  PgTypeColumn,
  PgTypeColumns,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";
import { GraphQLEnumValueConfigMap } from "graphql";
import { ExecutablePlan, ModifierPlan } from "dataplanner";

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
      orderByColumnEnum(options, { column, columnName, variant }) {
        const fieldName = this._columnName({ columnName, column });
        return this.constantCase(`${fieldName}-${variant}`);
      },
    },
  },

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
                      applyPlan: EXPORTABLE(
                        (column, columnName, isUnique, orderByNullsLast, sql) =>
                          (plan: ExecutablePlan | ModifierPlan): void => {
                            if (!(plan instanceof PgSelectPlan)) {
                              throw new Error(
                                "Expected a PgSelectPlan when applying ordering value",
                              );
                            }
                            plan.orderBy({
                              codec: column.codec,
                              fragment: sql`${plan.alias}.${sql.identifier(
                                columnName,
                              )}`,
                              direction: "ASC",
                              ...(orderByNullsLast != null
                                ? {
                                    nulls: orderByNullsLast ? "LAST" : "FIRST",
                                  }
                                : null),
                            });
                            if (isUnique) {
                              plan.setOrderIsUnique();
                            }
                          },
                        [column, columnName, isUnique, orderByNullsLast, sql],
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
                      applyPlan: EXPORTABLE(
                        (column, columnName, isUnique, orderByNullsLast, sql) =>
                          (plan: ExecutablePlan | ModifierPlan): void => {
                            if (!(plan instanceof PgSelectPlan)) {
                              throw new Error(
                                "Expected a PgSelectPlan when applying ordering value",
                              );
                            }
                            plan.orderBy({
                              codec: column.codec,
                              fragment: sql`${plan.alias}.${sql.identifier(
                                columnName,
                              )}`,
                              direction: "DESC",
                              ...(orderByNullsLast != null
                                ? {
                                    nulls: orderByNullsLast ? "LAST" : "FIRST",
                                  }
                                : null),
                            });
                            if (isUnique) {
                              plan.setOrderIsUnique();
                            }
                          },
                        [column, columnName, isUnique, orderByNullsLast, sql],
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
          }, {} as GraphQLEnumValueConfigMap),
          `Adding order values from table '${pgCodec.name}'`,
        );
      },
    },
  },
};
