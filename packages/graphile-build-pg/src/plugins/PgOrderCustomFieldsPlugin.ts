import "./PgTablesPlugin.js";
import "graphile-config";

import type { PgSelectStep, PgSource, PgSourceParameter } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
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

export const PgOrderCustomFieldsPlugin: GraphileConfig.Plugin = {
  name: "PgOrderCustomFieldsPlugin",
  description: "Adds ordering by 'computed column' functions",
  version: version,

  before: ["PgOrderAllColumnsPlugin"],

  inflection: {
    add: {
      computedColumnOrder(options, { source, variant }) {
        const computedColumnName = this.computedColumnField({ source });
        return this.constantCase(`${computedColumnName}-${variant}`);
      },
    },
  },

  schema: {
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { inflection, sql } = build;
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
          // TODO: should this be `proc:orderBy`? If so, should we make it so `getBehavior` accepts a prefix to prepend, so `"orderBy"` in a smart tag on a proc becomes `proc:orderBy`?
          return !!build.behavior.matches(behavior, "orderBy", "-orderBy");
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
                        applyPlan: EXPORTABLE(
                          (ascDesc, pgFieldSource, sql) =>
                            (plan: PgSelectStep<any, any, any, any>) => {
                              if (typeof pgFieldSource.source !== "function") {
                                throw new Error(
                                  "Invalid computed column source",
                                );
                              }
                              const expression = sql`${pgFieldSource.source({
                                placeholder: plan.alias,
                              })}`;
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
