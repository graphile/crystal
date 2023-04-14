import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecAttribute,
  PgCodecWithAttributes,
  PgResourceUnique,
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
      orderByAttributeEnum(
        this: Inflection,
        details: {
          codec: PgCodecWithAttributes;
          attributeName: string;
          attribute: PgCodecAttribute;
          variant: "asc" | "desc" | "asc_nulls_last" | "desc_nulls_last";
        },
      ): string;
    }
  }
}

export const PgOrderAllAttributesPlugin: GraphileConfig.Plugin = {
  name: "PgOrderAllAttributesPlugin",
  description: "Allows ordering by table attributes",
  version: version,

  inflection: {
    add: {
      orderByAttributeEnum(options, { codec, attributeName, variant }) {
        const fieldName = this._attributeName({ attributeName, codec });
        return this.constantCase(`${fieldName}-${variant}`);
      },
    },
  },

  schema: {
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { extend, inflection, options } = build;
        const {
          scope: { isPgRowSortEnum, pgCodec: rawPgCodec },
        } = context;
        const { orderByNullsLast } = options;
        if (
          !isPgRowSortEnum ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return values;
        }
        const pgCodec = rawPgCodec as PgCodecWithAttributes;
        const attributes = pgCodec.attributes;
        const sources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((s) => s.codec === pgCodec && !s.parameters);
        const uniques = sources.flatMap((s) => s.uniques as PgResourceUnique[]);
        return extend(
          values,
          Object.entries(attributes).reduce(
            (memo, [attributeName, attribute]) => {
              const behavior = getBehavior([
                pgCodec.extensions,
                attribute.extensions,
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
              if (attribute.codec.arrayOfCodec) {
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
              if (attribute.codec.rangeOfCodec) {
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
                (list) => list.attributes[0] === attributeName,
              );

              const ascFieldName = inflection.orderByAttributeEnum({
                attribute,
                codec: pgCodec,
                attributeName,
                variant: "asc",
              });
              const descFieldName = inflection.orderByAttributeEnum({
                attribute,
                codec: pgCodec,
                attributeName,
                variant: "desc",
              });
              memo = extend(
                memo,
                {
                  [ascFieldName]: {
                    extensions: {
                      grafast: {
                        applyPlan: EXPORTABLE(
                          (
                              PgSelectStep,
                              PgUnionAllStep,
                              attributeName,
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
                                attribute: attributeName,
                                direction: "ASC",
                                ...(orderByNullsLast != null
                                  ? {
                                      nulls: orderByNullsLast
                                        ? "LAST"
                                        : "FIRST",
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
                            attributeName,
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
                attribute,
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
                      grafast: {
                        applyPlan: EXPORTABLE(
                          (
                              PgSelectStep,
                              PgUnionAllStep,
                              attributeName,
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
                                attribute: attributeName,
                                direction: "DESC",
                                ...(orderByNullsLast != null
                                  ? {
                                      nulls: orderByNullsLast
                                        ? "LAST"
                                        : "FIRST",
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
                            attributeName,
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
                attribute,
                {
                  name: "newNameHere",
                },
              )}`,*/
              );
              return memo;
            },
            {} as GraphQLEnumValueConfigMap,
          ),
          `Adding order values from table '${pgCodec.name}'`,
        );
      },
    },
  },
};
