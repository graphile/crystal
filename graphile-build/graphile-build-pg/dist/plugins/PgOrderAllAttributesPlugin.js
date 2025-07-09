"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgOrderAllAttributesPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgOrderAllAttributesPlugin = {
    name: "PgOrderAllAttributesPlugin",
    description: "Allows ordering by table attributes",
    version: version_js_1.version,
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
                const { scope: { isPgRowSortEnum, pgCodec: rawPgCodec, pgPolymorphicSingleTableType, }, } = context;
                const { pgOrderByNullsLast } = options;
                if (!isPgRowSortEnum ||
                    !rawPgCodec ||
                    !rawPgCodec.attributes ||
                    rawPgCodec.isAnonymous) {
                    return values;
                }
                const pgCodec = rawPgCodec;
                const allAttributes = pgCodec.attributes;
                const allowedAttributes = pgCodec.polymorphism?.mode === "single"
                    ? [
                        ...pgCodec.polymorphism.commonAttributes,
                        ...(pgPolymorphicSingleTableType
                            ? pgCodec.polymorphism.types[pgPolymorphicSingleTableType.typeIdentifier].attributes.map((attr) => 
                            // FIXME: we should be factoring in the attr.rename
                            attr.attribute)
                            : []),
                    ]
                    : null;
                const attributes = allowedAttributes
                    ? Object.fromEntries(Object.entries(allAttributes).filter(([attrName, _attr]) => allowedAttributes.includes(attrName)))
                    : allAttributes;
                const resource = build.pgTableResource(pgCodec);
                const uniques = resource?.uniques ?? [];
                return extend(values, Object.entries(attributes).reduce((memo, [attributeName, _attribute]) => {
                    const fieldBehaviorScope = `attribute:orderBy`;
                    if (!build.behavior.pgCodecAttributeMatches([pgCodec, attributeName], fieldBehaviorScope)) {
                        return memo;
                    }
                    const isUnique = uniques.some((list) => list.attributes[0] === attributeName);
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
                    memo = extend(memo, {
                        [ascFieldName]: {
                            extensions: {
                                grafast: {
                                    apply: (0, graphile_build_1.EXPORTABLE)((attributeName, isUnique, pgOrderByNullsLast) => ((queryBuilder) => {
                                        queryBuilder.orderBy({
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
                                            queryBuilder.setOrderIsUnique();
                                        }
                                    }), [attributeName, isUnique, pgOrderByNullsLast]),
                                },
                            },
                        },
                    }, `Adding ascending orderBy enum value for ${pgCodec.name}.`);
                    memo = extend(memo, {
                        [descFieldName]: {
                            extensions: {
                                grafast: {
                                    apply: (0, graphile_build_1.EXPORTABLE)((attributeName, isUnique, pgOrderByNullsLast) => ((queryBuilder) => {
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
                                    }), [attributeName, isUnique, pgOrderByNullsLast]),
                                },
                            },
                        },
                    }, `Adding descending orderBy enum value for ${pgCodec.name}.`);
                    return memo;
                }, {}), `Adding order values from table '${pgCodec.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgOrderAllAttributesPlugin.js.map