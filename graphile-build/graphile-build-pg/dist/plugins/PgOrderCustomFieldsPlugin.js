"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgOrderCustomFieldsPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
const PgConditionCustomFieldsPlugin_js_1 = require("./PgConditionCustomFieldsPlugin.js");
exports.PgOrderCustomFieldsPlugin = {
    name: "PgOrderCustomFieldsPlugin",
    description: "Adds ordering by 'computed attribute' functions",
    version: version_js_1.version,
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
        behaviorRegistry: {
            add: {
                "proc:orderBy": {
                    entities: ["pgResource"],
                    description: "can we order by the result of this functional resource?",
                },
            },
        },
        entityBehavior: {
            pgResource: {
                inferred(behavior, resource) {
                    if ((0, PgConditionCustomFieldsPlugin_js_1.isSimpleScalarComputedColumnLike)(resource)) {
                        return [behavior, "-orderBy"];
                    }
                    else {
                        return behavior;
                    }
                },
            },
        },
        hooks: {
            GraphQLEnumType_values(values, build, context) {
                const { inflection, sql } = build;
                const { scope: { isPgRowSortEnum, pgCodec }, } = context;
                if (!isPgRowSortEnum ||
                    !pgCodec ||
                    !pgCodec.attributes ||
                    pgCodec.isAnonymous) {
                    return values;
                }
                const functionSources = Object.values(build.input.pgRegistry.pgResources).filter((resource) => {
                    if (!(0, PgConditionCustomFieldsPlugin_js_1.isSimpleScalarComputedColumnLike)(resource))
                        return false;
                    if (resource.parameters[0].codec !== pgCodec)
                        return false;
                    return !!build.behavior.pgResourceMatches(resource, "proc:orderBy");
                });
                return build.extend(values, functionSources.reduce((memo, pgFieldSource) => {
                    for (const ascDesc of ["asc", "desc"]) {
                        const valueName = inflection.computedAttributeOrder({
                            resource: pgFieldSource,
                            variant: ascDesc,
                        });
                        memo = build.extend(memo, {
                            [valueName]: {
                                extensions: {
                                    grafast: {
                                        apply: (0, graphile_build_1.EXPORTABLE)((ascDesc, pgFieldSource, sql) => ((queryBuilder) => {
                                            if (typeof pgFieldSource.from !== "function") {
                                                throw new Error("Invalid computed attribute 'from'");
                                            }
                                            const expression = sql `${pgFieldSource.from({
                                                placeholder: queryBuilder.alias,
                                            })}`;
                                            queryBuilder.orderBy({
                                                codec: pgFieldSource.codec,
                                                fragment: expression,
                                                direction: ascDesc.toUpperCase(),
                                            });
                                        }), [ascDesc, pgFieldSource, sql]),
                                    },
                                },
                            },
                        }, `Adding ascending orderBy enum value for ${pgCodec.name} from ${pgFieldSource}.`);
                    }
                    return memo;
                }, Object.create(null)), `Adding computed attribute orderable functions to order by for '${pgCodec.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgOrderCustomFieldsPlugin.js.map