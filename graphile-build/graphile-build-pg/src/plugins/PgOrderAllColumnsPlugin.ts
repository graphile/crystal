import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodec,
  PgResourceUnique,
  PgTypeColumn,
  PgTypeColumns,
} from "@dataplan/pg";
import { PgSelectStep, PgUnionAllStep } from "@dataplan/pg";
import type { ExecutableStep, ModifierStep } from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLEnumValueConfigMap } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      orderByColumnEnum(
        this: Inflection,
        details: {
          codec: PgCodec<any, any, any, any>;
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
      orderByColumnEnum(options, { codec, columnName, variant }) {
        const fieldName = this._columnName({ columnName, codec });
        return this.constantCase(`${fieldName}-${variant}`);
      },
    },
  },

  schema: {
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { extend, inflection, options } = build;
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
        const sources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((s) => s.codec === pgCodec && !s.parameters);
        const uniques = sources.flatMap((s) => s.uniques as PgResourceUnique[]);
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
                        (
                            PgSelectStep,
                            PgUnionAllStep,
                            columnName,
                            isUnique,
                            orderByNullsLast,
                          ) =>
                          (plan: ExecutableStep | ModifierStep): void => {
                            if (
                              !(plan instanceof PgSelectStep) &&
                              !(plan instanceof PgUnionAllStep)
                            ) {
                              throw new Error(
                                "Expected a PgSelectStep or PgUnionAllStep when applying ordering value",
                              );
                            }
                            plan.orderBy({
                              attribute: columnName,
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
                        [
                          PgSelectStep,
                          PgUnionAllStep,
                          columnName,
                          isUnique,
                          orderByNullsLast,
                        ],
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
                        (
                            PgSelectStep,
                            PgUnionAllStep,
                            columnName,
                            isUnique,
                            orderByNullsLast,
                          ) =>
                          (plan: ExecutableStep | ModifierStep): void => {
                            if (
                              !(plan instanceof PgSelectStep) &&
                              !(plan instanceof PgUnionAllStep)
                            ) {
                              throw new Error(
                                "Expected a PgSelectStep or PgUnionAllStep when applying ordering value",
                              );
                            }
                            plan.orderBy({
                              attribute: columnName,
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
                        [
                          PgSelectStep,
                          PgUnionAllStep,
                          columnName,
                          isUnique,
                          orderByNullsLast,
                        ],
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
