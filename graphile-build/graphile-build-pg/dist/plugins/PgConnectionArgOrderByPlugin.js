"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgConnectionArgOrderByPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgConnectionArgOrderByPlugin = {
    name: "PgConnectionArgOrderByPlugin",
    description: "Adds the 'orderBy' argument to connections and simple collections",
    version: version_js_1.version,
    after: ["PgConditionArgumentPlugin"],
    inflection: {
        add: {
            orderByType(options, typeName) {
                return this.upperCamelCase(`${typeName}-order-by`);
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "resource:connection:order": {
                    entities: ["pgResource"],
                    description: "",
                },
                "resource:list:order": {
                    entities: ["pgResource"],
                    description: "",
                },
            },
        },
        entityBehavior: {
            pgCodec: "order",
            pgResource: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred", "override"],
                    callback(behavior, resource) {
                        if (resource.parameters) {
                            return behavior;
                        }
                        else {
                            return ["order", behavior];
                        }
                    },
                },
            },
        },
        hooks: {
            init(_, build) {
                const { inflection, pgCodecMetaLookup } = build;
                pgCodecMetaLookup.forEach((meta, codec) => {
                    if (!codec.attributes || codec.isAnonymous)
                        return;
                    if (!build.behavior.pgCodecMatches(codec, "order")) {
                        return;
                    }
                    const tableTypeName = inflection.tableType(codec);
                    /* const TableOrderByType = */
                    const typeName = inflection.orderByType(tableTypeName);
                    build.registerEnumType(typeName, {
                        pgCodec: codec,
                        isPgRowSortEnum: true,
                    }, () => ({
                        description: build.wrapDescription(`Methods to use when ordering \`${tableTypeName}\`.`, "type"),
                        values: {
                            [inflection.builtin("NATURAL")]: {
                            // No need for hooks, it doesn't change the order
                            },
                        },
                    }), `Adding connection "orderBy" argument for ${codec.name}.`);
                    if (codec.polymorphism?.mode === "single") {
                        // ENHANCE: register OrderBy for each concrete type
                    }
                });
                return _;
            },
            GraphQLObjectType_fields_field_args(args, build, context) {
                const { extend, getTypeByName, graphql: { GraphQLList, GraphQLNonNull }, inflection, } = build;
                const { scope, Self } = context;
                const { fieldName, isPgFieldConnection, isPgFieldSimpleCollection, pgFieldResource: pgResource, pgFieldCodec, } = scope;
                if (!isPgFieldConnection && !isPgFieldSimpleCollection) {
                    return args;
                }
                const codec = pgFieldCodec ?? pgResource?.codec;
                const isSuitableSource = pgResource && pgResource.codec.attributes && !pgResource.isUnique;
                const isSuitableCodec = codec &&
                    (isSuitableSource ||
                        (!pgResource && codec?.polymorphism?.mode === "union")) &&
                    codec.attributes;
                if (!isSuitableCodec) {
                    return args;
                }
                if (pgResource
                    ? !build.behavior.pgResourceMatches(pgResource, "order")
                    : codec
                        ? !build.behavior.pgCodecMatches(codec, "order")
                        : false) {
                    return args;
                }
                const tableTypeName = inflection.tableType(codec);
                const tableOrderByTypeName = inflection.orderByType(tableTypeName);
                const TableOrderByType = getTypeByName(tableOrderByTypeName);
                if (!TableOrderByType) {
                    return args;
                }
                // TODO: inflection
                const argName = "orderBy";
                return extend(args, {
                    [argName]: {
                        description: build.wrapDescription(`The method to use when ordering \`${tableTypeName}\`.`, "arg"),
                        type: new GraphQLList(new GraphQLNonNull(TableOrderByType)),
                        applyPlan: isPgFieldConnection
                            ? (0, graphile_build_1.EXPORTABLE)(() => (parent, $connection, value) => {
                                const $select = $connection.getSubplan();
                                value.apply($select);
                            }, [])
                            : (0, graphile_build_1.EXPORTABLE)(() => (parent, $select, value) => {
                                value.apply($select);
                            }, []),
                    },
                }, `Adding '${argName}' (orderBy) argument to field '${fieldName}' of '${Self.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgConnectionArgOrderByPlugin.js.map