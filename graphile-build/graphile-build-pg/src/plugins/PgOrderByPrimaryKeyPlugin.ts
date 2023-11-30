import "./PgTablesPlugin.js";
import "graphile-config";

import type { GenericPgSelectStep } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      pgOrderByNullsLast?: boolean;
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
        const { pgOrderByNullsLast } = options;

        if (
          !isPgRowSortEnum ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return values;
        }

        const pgCodec = rawPgCodec;

        const resource = build.pgTableResource(pgCodec);
        if (!resource) {
          return values;
        }

        const primaryKey = resource.uniques.find((unique) => unique.isPrimary);
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
                    (pgCodec, pgOrderByNullsLast, primaryKeyAttributes, sql) =>
                      (step: GenericPgSelectStep) => {
                        primaryKeyAttributes.forEach((attributeName) => {
                          const attribute = pgCodec.attributes![attributeName];
                          step.orderBy({
                            codec: attribute.codec,
                            fragment: sql`${step.alias}.${sql.identifier(
                              attributeName,
                            )}`,
                            direction: "ASC",
                            ...(pgOrderByNullsLast != null
                              ? {
                                  nulls: pgOrderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        step.setOrderIsUnique();
                      },
                    [pgCodec, pgOrderByNullsLast, primaryKeyAttributes, sql],
                  ),
                },
              },
            },
            [inflection.builtin("PRIMARY_KEY_DESC")]: {
              extensions: {
                grafast: {
                  applyPlan: EXPORTABLE(
                    (pgCodec, pgOrderByNullsLast, primaryKeyAttributes, sql) =>
                      (step: GenericPgSelectStep) => {
                        primaryKeyAttributes.forEach((attributeName) => {
                          const attribute = pgCodec.attributes![attributeName];
                          step.orderBy({
                            codec: attribute.codec,
                            fragment: sql`${step.alias}.${sql.identifier(
                              attributeName,
                            )}`,
                            direction: "DESC",
                            ...(pgOrderByNullsLast != null
                              ? {
                                  nulls: pgOrderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        step.setOrderIsUnique();
                      },
                    [pgCodec, pgOrderByNullsLast, primaryKeyAttributes, sql],
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
