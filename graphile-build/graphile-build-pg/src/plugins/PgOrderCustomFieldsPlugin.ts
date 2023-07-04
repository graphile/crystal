import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgResource,
  PgResourceParameter,
  PgSelectStep,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";
import { isSimpleScalarComputedColumnLike } from "./PgConditionCustomFieldsPlugin.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      computedAttributeOrder(
        this: Inflection,
        details: {
          resource: PgResource<
            any,
            any,
            any,
            readonly PgResourceParameter[],
            any
          >;
          variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
        },
      ): string;
    }
  }
}

export const PgOrderCustomFieldsPlugin: GraphileConfig.Plugin = {
  name: "PgOrderCustomFieldsPlugin",
  description: "Adds ordering by 'computed attribute' functions",
  version: version,

  before: ["PgOrderAllAttributesPlugin"],

  inflection: {
    add: {
      computedAttributeOrder(options, { resource, variant }) {
        const computedAttributeName = this.computedAttributeField({ resource });
        return this.constantCase(`${computedAttributeName}-${variant}`);
      },
    },
  },

  schema: {
    entityBehavior: {
      pgResource: {
        provides: ["inferred"],
        after: ["default"],
        before: ["override"],
        callback(behavior, resource) {
          if (isSimpleScalarComputedColumnLike(resource)) {
            return [behavior, "-orderBy"];
          } else {
            return behavior;
          }
        },
      },
    },
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { inflection, sql } = build;
        const {
          scope: { isPgRowSortEnum, pgCodec },
        } = context;
        if (
          !isPgRowSortEnum ||
          !pgCodec ||
          !pgCodec.attributes ||
          pgCodec.isAnonymous
        ) {
          return values;
        }

        const functionSources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((resource) => {
          if (!isSimpleScalarComputedColumnLike(resource)) return false;
          if (resource.parameters![0].codec !== pgCodec) return false;
          // TODO: should this be `proc:orderBy`? If so, should we make it so `getBehavior` accepts a prefix to prepend, so `"orderBy"` in a smart tag on a proc becomes `proc:orderBy`?
          return !!build.behavior.pgResourceMatches(resource, "orderBy");
        });

        return build.extend(
          values,
          functionSources.reduce((memo, pgFieldSource) => {
            for (const ascDesc of ["asc" as const, "desc" as const]) {
              const valueName = inflection.computedAttributeOrder({
                resource: pgFieldSource as PgResource<
                  any,
                  any,
                  any,
                  readonly PgResourceParameter[],
                  any
                >,
                variant: ascDesc,
              });

              memo = build.extend(
                memo,
                {
                  [valueName]: {
                    extensions: {
                      grafast: {
                        applyPlan: EXPORTABLE(
                          (ascDesc, pgFieldSource, sql) =>
                            (step: PgSelectStep) => {
                              if (typeof pgFieldSource.from !== "function") {
                                throw new Error(
                                  "Invalid computed attribute 'from'",
                                );
                              }
                              const expression = sql`${pgFieldSource.from({
                                placeholder: step.alias,
                              })}`;
                              step.orderBy({
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
          }, Object.create(null)),
          `Adding computed attribute orderable functions to order by for '${pgCodec.name}'`,
        );
      },
    },
  },
};
