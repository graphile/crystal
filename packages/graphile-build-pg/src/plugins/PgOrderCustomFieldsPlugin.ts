import "./PgTablesPlugin";

import type {
  PgConditionPlan,
  PgSelectPlan,
  PgSelectSinglePlan,
  PgSource,
  PgSourceParameter,
  PgTypeCodec,
  PgTypeColumn,
  PgTypeColumns,
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
      computedColumnOrder(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, PgSourceParameter[]>;
          variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
        },
      ): string;
    }
  }
}

export const PgOrderCustomFieldsPlugin: Plugin = {
  name: "PgOrderCustomFieldsPlugin",
  description: "Adds ordering my 'computed column' functions",
  version: version,

  before: ["PgOrderAllColumnsPlugin"],

  inflection: {
    add: {
      computedColumnOrder(options, { source, variant }) {
        const computedColumnName = this.computedColumn({ source });
        return this.constantCase(`${computedColumnName}-${variant}`);
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

        const functionSources = build.input.pgSources.filter((source) => {
          if (source.codec.columns) return false;
          if (source.codec.arrayOfCodec) return false;
          if (source.codec.rangeOfCodec) return false;
          const parameters: PgSourceParameter[] | undefined = source.parameters;
          if (!parameters) return false;
          if (parameters.filter((p) => p.required).length !== 1) return false;
          if (parameters[0].codec !== pgCodec) return false;
          if (!source.isUnique) return false;
          const behavior = getBehavior(source.extensions);
          if (behavior && !behavior.includes("orderBy")) {
            return false;
          }
          return true;
        });

        return build.extend(
          values,
          functionSources.reduce((memo, pgFieldSource) => {
            for (const ascDesc of ["asc" as const, "desc" as const]) {
              const valueName = inflection.computedColumnOrder({
                source: pgFieldSource,
                variant: ascDesc,
              });

              memo = build.extend(
                memo,
                {
                  [valueName]: {
                    extensions: {
                      graphile: {
                        plan: EXPORTABLE(
                          (ascDesc, pgFieldSource, sql) =>
                            (plan: PgSelectPlan<any, any, any, any>) => {
                              if (typeof pgFieldSource.source !== "function") {
                                throw new Error(
                                  "Invalid computed column source",
                                );
                              }
                              const expression = sql`${pgFieldSource.source(
                                plan.alias,
                              )}`;
                              plan.orderBy({
                                codec: pgFieldSource.codec,
                                fragment: expression,
                                direction: ascDesc.toUpperCase() as
                                  | "ASC"
                                  | "DESC",
                              });
                            },
                          [ascDesc, pgFieldSource, sql],
                        ),
                      },
                    },
                  },
                },
                `Adding ascending orderBy enum value for ${pgCodec.name} from ${pgFieldSource}.`,
              );
            }

            return memo;
          }, {}),
          `Adding computed column orderable functions to order by for '${pgCodec.name}'`,
        );

        return values;
      },
    },
  },
};
