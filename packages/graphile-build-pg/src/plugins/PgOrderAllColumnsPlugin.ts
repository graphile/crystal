import "./PgTablesPlugin";

import type {
  PgSelectPlan,
  PgSourceUnique,
  PgTypeCodec,
  PgTypeColumn,
  PgTypeColumns,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";
import type { Plugin } from "graphile-plugin";

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
export const PgOrderAllColumnsPlugin: Plugin = {
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
            const behavior = getBehavior(column.extensions);
            if (behavior && !behavior.includes("order")) {
              return memo;
            }
            if (!behavior) {
              // Unless explicitly told to, do not allow ordering by arrays/ranges
              if (column.codec.arrayOfCodec || column.codec.rangeOfCodec) {
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
