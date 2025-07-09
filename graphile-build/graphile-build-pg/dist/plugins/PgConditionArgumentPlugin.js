"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgConditionArgumentPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const version_js_1 = require("../version.js");
exports.PgConditionArgumentPlugin = {
    name: "PgConditionArgumentPlugin",
    description: "Adds the 'condition' argument to connections and lists",
    version: version_js_1.version,
    inflection: {
        add: {
            conditionType(options, typeName) {
                return this.upperCamelCase(`${typeName}-condition`);
            },
        },
    },
    schema: {
        entityBehavior: {
            pgCodec: ["select", "filter"],
            pgResource: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred", "override"],
                    callback(behavior, resource) {
                        return resource.parameters ? [behavior] : ["filter", behavior];
                    },
                },
            },
        },
        hooks: {
            init(_, build) {
                const { inflection } = build;
                for (const rawCodec of build.pgCodecMetaLookup.keys()) {
                    build.recoverable(null, () => {
                        // Ignore scalar codecs
                        if (!rawCodec.attributes || rawCodec.isAnonymous) {
                            return;
                        }
                        const codec = rawCodec;
                        const tableTypeName = inflection.tableType(codec);
                        const conditionName = inflection.conditionType(tableTypeName);
                        /* const TableConditionType = */
                        build.registerInputObjectType(conditionName, {
                            isPgCondition: true,
                            pgCodec: codec,
                        }, () => ({
                            description: build.wrapDescription(`A condition to be used against \`${tableTypeName}\` object types. All fields are tested for equality and combined with a logical ‘and.’`, "type"),
                        }), `Adding condition type for ${codec.name}.`);
                    });
                }
                return _;
            },
            GraphQLObjectType_fields_field_args(args, build, context) {
                const { EXPORTABLE } = build;
                const { scope, Self } = context;
                const { fieldName, fieldBehaviorScope, isPgFieldConnection, isPgFieldSimpleCollection, pgFieldResource: pgResource, pgFieldCodec, } = scope;
                const shouldAddCondition = isPgFieldConnection || isPgFieldSimpleCollection;
                const codec = pgFieldCodec ?? pgResource?.codec;
                const isSuitableSource = pgResource && pgResource.codec.attributes && !pgResource.isUnique;
                const isSuitableCodec = codec &&
                    (isSuitableSource ||
                        (!pgResource && codec?.polymorphism?.mode === "union")) &&
                    codec.attributes;
                if (!shouldAddCondition || !isSuitableCodec) {
                    return args;
                }
                const desiredBehavior = fieldBehaviorScope
                    ? `${fieldBehaviorScope}:filter`
                    : `filter`;
                if (pgResource
                    ? !build.behavior.pgResourceMatches(pgResource, desiredBehavior)
                    : codec
                        ? !build.behavior.pgCodecMatches(codec, desiredBehavior)
                        : true) {
                    return args;
                }
                const tableTypeName = build.inflection.tableType(codec);
                const tableConditionTypeName = build.inflection.conditionType(tableTypeName);
                const tableConditionType = build.getTypeByName(tableConditionTypeName);
                if (!tableConditionType) {
                    return args;
                }
                return build.extend(args, {
                    condition: {
                        description: build.wrapDescription("A condition to be used in determining which values should be returned by the collection.", "arg"),
                        type: tableConditionType,
                        applyPlan: isPgFieldConnection
                            ? EXPORTABLE((qbWhereBuilder) => (_condition, $connection, arg) => {
                                const $select = $connection.getSubplan();
                                arg.apply($select, qbWhereBuilder);
                            }, [qbWhereBuilder])
                            : EXPORTABLE((qbWhereBuilder) => (_condition, $select, arg) => {
                                arg.apply($select, qbWhereBuilder);
                            }, [qbWhereBuilder]),
                    },
                }, `Adding condition to connection field '${fieldName}' of '${Self.name}'`);
            },
        },
    },
};
function qbWhereBuilder(qb) {
    return qb.whereBuilder();
}
//# sourceMappingURL=PgConditionArgumentPlugin.js.map