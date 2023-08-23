import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecAttribute,
  PgCodecWithAttributes,
  PgResourceUnique,
} from "@dataplan/pg";
import { PgSelectStep, PgUnionAllStep } from "@dataplan/pg";
import type { ExecutableStep, ModifierStep } from "grafast";
import type { GraphQLEnumValueConfigMap } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

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
          scope: {
            isPgRowSortEnum,
            pgCodec: rawPgCodec,
            pgPolymorphicSingleTableType,
          },
        } = context;
        const { pgOrderByNullsLast } = options;
        if (
          !isPgRowSortEnum ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return values;
        }
        const pgCodec = rawPgCodec as PgCodecWithAttributes;
        const allAttributes = pgCodec.attributes;
        const allowedAttributes =
          pgCodec.polymorphism?.mode === "single"
            ? [
                ...pgCodec.polymorphism.commonAttributes,
                ...(pgPolymorphicSingleTableType
                  ? pgCodec.polymorphism.types[
                      pgPolymorphicSingleTableType.typeIdentifier
                    ].attributes.map(
                      (attr) =>
                        // FIXME: we should be factoring in the attr.rename
                        attr.attribute,
                    )
                  : []),
              ]
            : null;
        const attributes = allowedAttributes
          ? Object.fromEntries(
              Object.entries(allAttributes).filter(([attrName, _attr]) =>
                allowedAttributes.includes(attrName),
              ),
            )
          : allAttributes;
        const resource = build.pgTableResource(pgCodec);
        if (!resource) {
          return values;
        }
        return extend(
          values,
          Object.entries(attributes).reduce(
            (memo, [attributeName, attribute]) => {
              const fieldBehaviorScope = `attribute:orderBy`;
              if (
                !build.behavior.pgCodecAttributeMatches(
                  [pgCodec, attributeName],
                  fieldBehaviorScope,
                )
              ) {
                return memo;
              }
              const isUnique = resource.uniques.some(
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
                              pgOrderByNullsLast,
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
                                ...(pgOrderByNullsLast != null
                                  ? {
                                      nulls: pgOrderByNullsLast
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
                            pgOrderByNullsLast,
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
                              pgOrderByNullsLast,
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
                                ...(pgOrderByNullsLast != null
                                  ? {
                                      nulls: pgOrderByNullsLast
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
                            pgOrderByNullsLast,
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
