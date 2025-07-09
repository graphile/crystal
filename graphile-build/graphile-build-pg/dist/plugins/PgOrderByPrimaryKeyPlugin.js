"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgOrderByPrimaryKeyPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgOrderByPrimaryKeyPlugin = {
    name: "PgOrderByPrimaryKeyPlugin",
    description: "Adds ordering by the table's primary key",
    version: version_js_1.version,
    schema: {
        hooks: {
            GraphQLEnumType_values(values, build, context) {
                const { extend, inflection, options } = build;
                const { scope: { isPgRowSortEnum, pgCodec: rawPgCodec }, } = context;
                const { pgOrderByNullsLast } = options;
                if (!isPgRowSortEnum ||
                    !rawPgCodec ||
                    !rawPgCodec.attributes ||
                    rawPgCodec.isAnonymous) {
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
                const primaryKeyAttributes = primaryKey.attributes;
                return extend(values, {
                    [inflection.builtin("PRIMARY_KEY_ASC")]: {
                        extensions: {
                            grafast: {
                                apply: (0, graphile_build_1.EXPORTABLE)((pgOrderByNullsLast, primaryKeyAttributes) => ((queryBuilder) => {
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
                                }), [pgOrderByNullsLast, primaryKeyAttributes]),
                            },
                        },
                    },
                    [inflection.builtin("PRIMARY_KEY_DESC")]: {
                        extensions: {
                            grafast: {
                                apply: (0, graphile_build_1.EXPORTABLE)((pgOrderByNullsLast, primaryKeyAttributes) => ((queryBuilder) => {
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
                                }), [pgOrderByNullsLast, primaryKeyAttributes]),
                            },
                        },
                    },
                }, `Adding primary key asc/desc sort to table '${pgCodec.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgOrderByPrimaryKeyPlugin.js.map