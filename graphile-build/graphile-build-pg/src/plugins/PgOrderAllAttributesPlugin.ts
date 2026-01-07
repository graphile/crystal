import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecWithAttributes,
  PgSelectQueryBuilder,
  PgSelectQueryBuilderCallback,
  PgUnionAllQueryBuilder,
} from "@dataplan/pg";
import type { GraphQLEnumValueConfigMap } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgOrderAllAttributesPlugin: true;
    }
  }
  namespace GraphileBuild {
    interface Inflection {
      orderByAttributeEnum(
        this: Inflection,
        details: {
          codec: PgCodecWithAttributes;
          attributeName: string;
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
        const { extend, inflection, options, sql } = build;
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
        const uniques = resource?.uniques ?? [];
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
              const isUnique = uniques.some(
                (list) => list.attributes[0] === attributeName,
              );

              const ascFieldName = inflection.orderByAttributeEnum({
                codec: pgCodec,
                attributeName,
                variant: "asc",
              });
              const descFieldName = inflection.orderByAttributeEnum({
                codec: pgCodec,
                attributeName,
                variant: "desc",
              });
              let apply: PgSelectQueryBuilderCallback;
              if (attribute.via) {
                // TODO: assert that this won't be a PgUnionAllQueryBuilder at runtime
                const resource = build.pgTableResource(pgCodec);
                if (!resource) {
                  throw new Error(
                    `Could not determine resource for codec ${pgCodec.name}`,
                  );
                }
                const {
                  relationName,
                  attributeName: targetAttributeName,
                  attribute: { codec: targetCodec },
                } = resource.resolveVia(attribute.via, attributeName);

                apply = EXPORTABLE(
                  (
                    isUnique,
                    pgOrderByNullsLast,
                    relationName,
                    sql,
                    targetAttributeName,
                    targetCodec,
                  ) =>
                    ((queryBuilder: PgSelectQueryBuilder): void => {
                      const alias = queryBuilder.singleRelation(relationName);
                      queryBuilder.orderBy({
                        fragment: sql`${alias}.${sql.identifier(targetAttributeName)}`,
                        codec: targetCodec,
                        direction: "ASC",
                        ...(pgOrderByNullsLast != null
                          ? { nulls: pgOrderByNullsLast ? "LAST" : "FIRST" }
                          : null),
                      });
                      if (isUnique) {
                        queryBuilder.setOrderIsUnique();
                      }
                    }) as PgSelectQueryBuilderCallback,
                  [
                    isUnique,
                    pgOrderByNullsLast,
                    relationName,
                    sql,
                    targetAttributeName,
                    targetCodec,
                  ],
                );
              } else {
                apply = EXPORTABLE(
                  (attributeName, isUnique, pgOrderByNullsLast) =>
                    ((
                      queryBuilder:
                        | PgSelectQueryBuilder
                        | PgUnionAllQueryBuilder,
                    ): void => {
                      queryBuilder.orderBy({
                        attribute: attributeName,
                        direction: "ASC",
                        ...(pgOrderByNullsLast != null
                          ? { nulls: pgOrderByNullsLast ? "LAST" : "FIRST" }
                          : null),
                      });
                      if (isUnique) {
                        queryBuilder.setOrderIsUnique();
                      }
                    }) as PgSelectQueryBuilderCallback,
                  [attributeName, isUnique, pgOrderByNullsLast],
                );
              }
              memo = extend(
                memo,
                {
                  [ascFieldName]: {
                    extensions: {
                      grafast: {
                        apply,
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
                        apply: EXPORTABLE(
                          (attributeName, isUnique, pgOrderByNullsLast) =>
                            ((
                              queryBuilder:
                                | PgSelectQueryBuilder
                                | PgUnionAllQueryBuilder,
                            ): void => {
                              queryBuilder.orderBy({
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
                                queryBuilder.setOrderIsUnique();
                              }
                            }) as PgSelectQueryBuilderCallback,
                          [attributeName, isUnique, pgOrderByNullsLast],
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
            Object.create(null) as GraphQLEnumValueConfigMap,
          ),
          `Adding order values from table '${pgCodec.name}'`,
        );
      },
    },
  },
};
