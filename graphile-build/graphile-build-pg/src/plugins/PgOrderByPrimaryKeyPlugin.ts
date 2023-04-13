import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecWithAttributes,
  PgResourceUnique,
  PgSelectStep,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      // TODO: rename to `pgOrderByNullsLast`?
      orderByNullsLast?: boolean;
    }
  }
}

export const PgOrderByPrimaryKeyPlugin: GraphileConfig.Plugin = {
  name: "PgOrderByPrimaryKeyPlugin",
  description: "Adds ordering by the table's primary key",
  version: version,

  schema: {
    hooks: {
      GraphQLEnumType_values(values, build, context) {
        const { extend, inflection, sql, options } = build;
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

        const resources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((s) => s.codec === pgCodec && !s.parameters);
        if (resources.length < 1) {
          return values;
        }

        const primaryKey = (resources[0].uniques as PgResourceUnique[]).find(
          (resource) => resource.isPrimary,
        );
        if (!primaryKey) {
          return values;
        }
        const primaryKeyAttributes = primaryKey.attributes as string[];

        return extend(
          values,
          {
            [inflection.builtin("PRIMARY_KEY_ASC")]: {
              extensions: {
                grafast: {
                  applyPlan: EXPORTABLE(
                    (orderByNullsLast, pgCodec, primaryKeyAttributes, sql) =>
                      (step: PgSelectStep) => {
                        primaryKeyAttributes.forEach((attributeName) => {
                          const attribute = pgCodec.attributes[attributeName];
                          step.orderBy({
                            codec: attribute.codec,
                            fragment: sql`${step.alias}.${sql.identifier(
                              attributeName,
                            )}`,
                            direction: "ASC",
                            ...(orderByNullsLast != null
                              ? {
                                  nulls: orderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        step.setOrderIsUnique();
                      },
                    [orderByNullsLast, pgCodec, primaryKeyAttributes, sql],
                  ),
                },
              },
            },
            [inflection.builtin("PRIMARY_KEY_DESC")]: {
              extensions: {
                grafast: {
                  applyPlan: EXPORTABLE(
                    (orderByNullsLast, pgCodec, primaryKeyAttributes, sql) =>
                      (step: PgSelectStep) => {
                        primaryKeyAttributes.forEach((attributeName) => {
                          const attribute = pgCodec.attributes[attributeName];
                          step.orderBy({
                            codec: attribute.codec,
                            fragment: sql`${step.alias}.${sql.identifier(
                              attributeName,
                            )}`,
                            direction: "DESC",
                            ...(orderByNullsLast != null
                              ? {
                                  nulls: orderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        step.setOrderIsUnique();
                      },
                    [orderByNullsLast, pgCodec, primaryKeyAttributes, sql],
                  ),
                },
              },
            },
          },
          `Adding primary key asc/desc sort to table '${pgCodec.name}'`,
        );
      },
    },
  },
};
