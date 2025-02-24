import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecWithAttributes,
  PgResourceUnique,
  PgSelectQueryBuilder,
  PgSelectQueryBuilderCallback,
  PgUnionAllQueryBuilder,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgOrderByPrimaryKeyPlugin: true;
    }
  }

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
        const { extend, inflection, options } = build;
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

        const pgCodec = rawPgCodec as PgCodecWithAttributes;

        const resource = build.pgTableResource(pgCodec);
        if (!resource) {
          return values;
        }

        const primaryKey = (resource.uniques as PgResourceUnique[]).find(
          (unique) => unique.isPrimary,
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
                  apply: EXPORTABLE(
                    (pgOrderByNullsLast, primaryKeyAttributes) =>
                      ((
                        queryBuilder:
                          | PgSelectQueryBuilder
                          | PgUnionAllQueryBuilder,
                      ) => {
                        primaryKeyAttributes.forEach((attributeName) => {
                          queryBuilder.orderBy({
                            attribute: attributeName,
                            direction: "ASC",
                            ...(pgOrderByNullsLast != null
                              ? {
                                  nulls: pgOrderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        queryBuilder.setOrderIsUnique();
                      }) as PgSelectQueryBuilderCallback,
                    [pgOrderByNullsLast, primaryKeyAttributes],
                  ),
                },
              },
            },
            [inflection.builtin("PRIMARY_KEY_DESC")]: {
              extensions: {
                grafast: {
                  apply: EXPORTABLE(
                    (pgOrderByNullsLast, primaryKeyAttributes) =>
                      ((
                        queryBuilder:
                          | PgSelectQueryBuilder
                          | PgUnionAllQueryBuilder,
                      ) => {
                        primaryKeyAttributes.forEach((attributeName) => {
                          queryBuilder.orderBy({
                            attribute: attributeName,
                            direction: "DESC",
                            ...(pgOrderByNullsLast != null
                              ? {
                                  nulls: pgOrderByNullsLast ? "LAST" : "FIRST",
                                }
                              : null),
                          });
                        });
                        queryBuilder.setOrderIsUnique();
                      }) as PgSelectQueryBuilderCallback,
                    [pgOrderByNullsLast, primaryKeyAttributes],
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
