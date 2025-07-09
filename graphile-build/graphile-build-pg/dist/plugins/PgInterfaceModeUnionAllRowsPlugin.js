"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgInterfaceModeUnionAllRowsPlugin = void 0;
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgInterfaceModeUnionAllRowsPlugin = {
    name: "PgInterfaceModeUnionAllRowsPlugin",
    version: version_js_1.version,
    inflection: {
        add: {
            _allInterfaceModeUnionRows(options, codec) {
                return this.camelCase(`all-${this.pluralize(this._singularizedCodecName(codec))}`);
            },
            allInterfaceModeUnionRowsConnection(options, codec) {
                return this.connectionField(this._allInterfaceModeUnionRows(codec));
            },
            allInterfaceModeUnionRowsList(options, codec) {
                return this.listField(this._allInterfaceModeUnionRows(codec));
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "query:interface:connection": {
                    description: "Should we add a root-level query field to fetch a connection over all rows matching this codec interface?",
                    entities: ["pgCodec"],
                },
                "query:interface:list": {
                    description: "Should we add a root-level query field to fetch all rows matching this codec interface?",
                    entities: ["pgCodec"],
                },
            },
        },
        entityBehavior: {
            pgCodec: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred"],
                    callback(behavior, entity) {
                        if (entity.polymorphism?.mode === "union") {
                            // TODO: explain why this exists! Also, why is it default and not inferred?
                            return ["connection", "-list", behavior];
                        }
                        else {
                            return behavior;
                        }
                    },
                },
            },
        },
        hooks: {
            GraphQLObjectType_fields(fields, build, context) {
                const { getTypeByName, inflection, graphql: { GraphQLList, GraphQLNonNull }, pgResourcesByPolymorphicTypeName, pgCodecByPolymorphicUnionModeTypeName, } = build;
                const { scope: { isRootQuery }, fieldWithHooks, } = context;
                if (!isRootQuery) {
                    return fields;
                }
                for (const [polymorphicTypeName, spec] of Object.entries(pgResourcesByPolymorphicTypeName)) {
                    if (spec.type === "union") {
                        // We can't add a root field for a basic union because there's
                        // nothing to order it by - we wouldn't be able to reliably
                        // paginate.
                    }
                    else if (spec.type === "interface") {
                        const interfaceCodec = pgCodecByPolymorphicUnionModeTypeName[polymorphicTypeName];
                        if (!interfaceCodec) {
                            console.warn(`A number of resources claim to implement '${polymorphicTypeName}', but we couldn't find the definition for that type so we won't add a root field for it. (Perhaps you implemented it in makeExtendSchemaPlugin?) Affected resources: ${spec.resources
                                .map((r) => r.name)
                                .join(", ")}`);
                            continue;
                        }
                        if (interfaceCodec.polymorphism?.mode !== "union") {
                            // 'single' and 'relational' are already handled by PgAllRowsPlugin
                            continue;
                        }
                        const makeField = (useConnection) => {
                            if (!interfaceCodec.polymorphism)
                                return;
                            const type = getTypeByName(inflection.tableType(interfaceCodec));
                            if (!type)
                                return;
                            const fieldType = useConnection
                                ? getTypeByName(inflection.tableConnectionType(interfaceCodec))
                                : // TODO: nullability.
                                    new GraphQLList(new GraphQLNonNull(type));
                            if (!fieldType)
                                return;
                            const fieldName = useConnection
                                ? inflection.allInterfaceModeUnionRowsConnection(interfaceCodec)
                                : inflection.allInterfaceModeUnionRowsList(interfaceCodec);
                            if (!interfaceCodec.attributes)
                                return;
                            const attributes = interfaceCodec.attributes;
                            const resourceByTypeName = Object.create(null);
                            const members = [];
                            for (const resource of spec.resources) {
                                const typeName = inflection.tableType(resource.codec);
                                resourceByTypeName[typeName] = resource;
                                members.push({
                                    resource,
                                    typeName,
                                });
                            }
                            const interfaceCodecName = interfaceCodec.name;
                            build.extend(fields, {
                                [fieldName]: fieldWithHooks({
                                    fieldName,
                                    isPgFieldConnection: useConnection,
                                    isPgFieldSimpleCollection: !useConnection,
                                    pgFieldCodec: interfaceCodec,
                                }, {
                                    type: fieldType,
                                    plan: (0, graphile_build_1.EXPORTABLE)((attributes, connection, interfaceCodecName, members, pgUnionAll, resourceByTypeName, useConnection) => {
                                        return function plan() {
                                            const $list = pgUnionAll({
                                                attributes,
                                                resourceByTypeName,
                                                members,
                                                name: interfaceCodecName,
                                            });
                                            return useConnection ? connection($list) : $list;
                                        };
                                    }, [
                                        attributes,
                                        grafast_1.connection,
                                        interfaceCodecName,
                                        members,
                                        pg_1.pgUnionAll,
                                        resourceByTypeName,
                                        useConnection,
                                    ]),
                                }),
                            }, `Adding polymorphic "all rows" ${useConnection ? "connection" : "list"} field for ${interfaceCodec.name} to the root query`);
                        };
                        if (build.behavior.pgCodecMatches(interfaceCodec, "query:interface:connection")) {
                            makeField(true);
                        }
                        if (build.behavior.pgCodecMatches(interfaceCodec, "query:interface:list")) {
                            makeField(false);
                        }
                    }
                    else {
                        const never = spec.type;
                        console.warn(`GraphileInternalError<f107e83d-087e-4116-8aaf-15da83f76f88>: Internal consistency issue: ${never} unhandled`);
                    }
                }
                return fields;
            },
        },
    },
};
//# sourceMappingURL=PgInterfaceModeUnionAllRowsPlugin.js.map