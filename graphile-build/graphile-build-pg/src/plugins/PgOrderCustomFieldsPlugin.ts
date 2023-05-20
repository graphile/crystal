import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgResource,
  PgResourceParameter,
  PgSelectStep,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-build";

import { getBehavior } from "../behavior.js";
import { version } from "../version.js";

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
          if (resource.codec.attributes) return false;
          if (resource.codec.arrayOfCodec) return false;
          if (resource.codec.rangeOfCodec) return false;
          const parameters: readonly PgResourceParameter[] | undefined =
            resource.parameters;
          if (!parameters || parameters.length < 1) return false;
          if (parameters.some((p, i) => i > 0 && p.required)) return false;
          if (parameters[0].codec !== pgCodec) return false;
          if (!resource.isUnique) return false;
          const behavior = getBehavior([
            resource.codec.extensions,
            resource.extensions,
          ]);
          // TODO: should this be `proc:orderBy`? If so, should we make it so `getBehavior` accepts a prefix to prepend, so `"orderBy"` in a smart tag on a proc becomes `proc:orderBy`?
          return !!build.behavior.matches(behavior, "orderBy", "-orderBy");
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
