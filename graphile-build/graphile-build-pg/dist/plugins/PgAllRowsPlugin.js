"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgAllRowsPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.PgAllRowsPlugin = {
    name: "PgAllRowsPlugin",
    description: "Adds 'all rows' accessors for all table-like datasources.",
    version: version_js_1.version,
    after: ["PgTablesPlugin"],
    inflection: {
        add: {
            _allRows(options, resource) {
                return this.camelCase(`all-${this.pluralize(this._singularizedResourceName(resource))}`);
            },
            allRowsConnection(options, resource) {
                return this.connectionField(this._allRows(resource));
            },
            allRowsList(options, resource) {
                return this.listField(this._allRows(resource));
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "query:resource:connection": {
                    description: '"connection" field for a resource at the root Query level',
                    entities: ["pgCodec", "pgResource", "pgResourceUnique"],
                },
                "query:resource:list": {
                    description: '"list" field for a resource at the root Query level',
                    entities: ["pgCodec", "pgResource", "pgResourceUnique"],
                },
            },
        },
        hooks: {
            GraphQLObjectType_fields(fields, build, context) {
                const { graphql: { GraphQLList, GraphQLNonNull }, } = build;
                const { fieldWithHooks } = context;
                if (!context.scope.isRootQuery) {
                    return fields;
                }
                for (const resource of Object.values(build.input.pgRegistry.pgResources)) {
                    if (resource.parameters) {
                        // Skip functions
                        continue;
                    }
                    if (!resource.find || resource.isVirtual) {
                        continue;
                    }
                    const type = build.getTypeByName(build.inflection.tableType(resource.codec));
                    if (!type) {
                        continue;
                    }
                    if (build.behavior.pgResourceMatches(resource, "query:resource:list")) {
                        const fieldName = build.inflection.allRowsList(resource);
                        fields = build.extend(fields, {
                            [fieldName]: fieldWithHooks({
                                fieldName,
                                fieldBehaviorScope: `query:resource:list`,
                                isPgFieldSimpleCollection: true,
                                pgFieldResource: resource,
                            }, () => ({
                                type: new GraphQLList(new GraphQLNonNull(type)),
                                description: `Reads a set of \`${build.inflection.tableType(resource.codec)}\`.`,
                                deprecationReason: (0, utils_js_1.tagToString)(resource.extensions?.tags?.deprecated),
                                plan: (0, graphile_build_1.EXPORTABLE)((resource) => function plan() {
                                    return resource.find();
                                }, [resource]),
                            })),
                        }, `Adding 'all rows' list field for PgResource ${resource}`);
                    }
                    if (build.behavior.pgResourceMatches(resource, "query:resource:connection")) {
                        const fieldName = build.inflection.allRowsConnection(resource);
                        const connectionType = build.getTypeByName(build.inflection.tableConnectionType(resource.codec));
                        if (connectionType) {
                            fields = build.extend(fields, {
                                [fieldName]: fieldWithHooks({
                                    fieldName,
                                    fieldBehaviorScope: `query:resource:connection`,
                                    isPgFieldConnection: true,
                                    pgFieldResource: resource,
                                }, () => ({
                                    type: connectionType,
                                    description: `Reads and enables pagination through a set of \`${build.inflection.tableType(resource.codec)}\`.`,
                                    deprecationReason: (0, utils_js_1.tagToString)(resource.extensions?.tags?.deprecated),
                                    plan: (0, graphile_build_1.EXPORTABLE)((connection, resource) => function plan() {
                                        return connection(resource.find());
                                    }, [grafast_1.connection, resource]),
                                })),
                            }, `Adding 'all rows' connection field for PgResource ${resource}`);
                        }
                    }
                }
                return fields;
            },
        },
    },
};
//# sourceMappingURL=PgAllRowsPlugin.js.map