import "./PgTablesPlugin";

import type {
  PgConditionPlan,
  PgSelectPlan,
  PgSelectSinglePlan,
  PgSourceColumn,
  PgSourceColumns,
  PgTypeCodec,
} from "@dataplan/pg";
import type { ConnectionPlan, InputPlan } from "graphile-crystal";
import { getEnumValueConfig } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLEnumType, GraphQLInputType } from "graphql";
import { inspect } from "util";

import { getBehavior } from "../behavior";
import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      orderByColumnEnum(
        this: Inflection,
        details: {
          codec: PgTypeCodec<any, any, any, any>;
          columnName: string;
          column: PgSourceColumn;
          variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
        },
      ): string;
    }
  }
}

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
        const columns = pgCodec.columns as PgSourceColumns;
        const sources = build.input.pgSources.filter(
          (s) => s.codec === pgCodec && !s.parameters,
        );
        const uniques = sources.flatMap((s) => s.uniques);
        return extend(
          values,
          Object.entries(columns).reduce((memo, [columnName, column]) => {
            const behavior = getBehavior(column.extensions);
            if (behavior && !behavior.includes("order")) {
              return memo;
            }
            const isUnique = uniques.some((list) => list[0] === columnName);

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
                        (column, columnName, isUnique, sql) => (plan: PgSelectPlan<any, any, any, any>) => {
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
                        (column, columnName, isUnique, sql) => (plan: PgSelectPlan<any, any, any, any>) => {
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
