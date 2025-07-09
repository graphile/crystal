"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgMutationPayloadEdgePlugin = void 0;
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.PgMutationPayloadEdgePlugin = {
    name: "PgMutationPayloadEdgePlugin",
    description: "Adds 'edge' field to mutation payloads to aid with Relay pagination",
    version: version_js_1.version,
    inflection: {
        add: {
            tableEdgeField(options, codec) {
                return this.camelCase(this.tableEdgeType(codec));
            },
        },
    },
    schema: {
        hooks: {
            GraphQLObjectType_fields(fields, build, context) {
                const { extend, getTypeByName, graphql: { GraphQLList, GraphQLNonNull }, inflection, } = build;
                const { scope: { isMutationPayload, pgTypeResource, pgCodec: _pgCodec }, fieldWithHooks, Self, } = context;
                const pgCodec = pgTypeResource?.codec ?? _pgCodec;
                if (!isMutationPayload ||
                    !pgCodec ||
                    !pgCodec.attributes ||
                    pgCodec.isAnonymous) {
                    return fields;
                }
                if (pgTypeResource?.parameters && !pgTypeResource.isUnique) {
                    return fields;
                }
                if (pgTypeResource
                    ? !build.behavior.pgResourceMatches(pgTypeResource, "connection")
                    : !build.behavior.pgCodecMatches(pgCodec, "connection")) {
                    return fields;
                }
                const resource = build.pgTableResource(pgCodec);
                if (!resource) {
                    return fields;
                }
                const pk = resource.uniques?.find((u) => u.isPrimary);
                if (!pk) {
                    return fields;
                }
                const pkAttributes = pk.attributes;
                const TableType = build.getGraphQLTypeByPgCodec(pgCodec, "output");
                if (!TableType) {
                    return fields;
                }
                const tableTypeName = TableType.name;
                const tableOrderByTypeName = inflection.orderByType(tableTypeName);
                const TableOrderByType = getTypeByName(tableOrderByTypeName);
                if (!TableOrderByType) {
                    return fields;
                }
                const TableEdgeType = getTypeByName(inflection.tableEdgeType(resource.codec));
                if (!TableEdgeType) {
                    return fields;
                }
                const fieldName = inflection.tableEdgeField(resource.codec);
                const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
                const defaultValueEnum = TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
                    TableOrderByType.getValues()[0];
                return extend(fields, {
                    [fieldName]: fieldWithHooks({
                        fieldName,
                        isPgMutationPayloadEdgeField: true,
                        pgCodec: pgCodec,
                    }, () => ({
                        description: build.wrapDescription(`An edge for our \`${tableTypeName}\`. May be used by Relay 1.`, "field"),
                        type: TableEdgeType,
                        args: {
                            orderBy: {
                                description: build.wrapDescription(`The method to use when ordering \`${tableTypeName}\`.`, "arg"),
                                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TableOrderByType))),
                                defaultValue: defaultValueEnum
                                    ? [defaultValueEnum.value]
                                    : null,
                            },
                        },
                        deprecationReason: (0, utils_js_1.tagToString)(resource.extensions?.tags?.deprecated),
                        // ENHANCE: review this plan, it feels overly complex and somewhat hacky.
                        plan: (0, graphile_build_1.EXPORTABLE)((EdgeStep, PgDeleteSingleStep, connection, constant, first, pgSelectFromRecord, pkAttributes, resource) => function plan($mutation, fieldArgs) {
                            const $result = $mutation.getStepForKey("result", true);
                            if (!$result) {
                                return constant(null);
                            }
                            const $select = (() => {
                                if ($result instanceof PgDeleteSingleStep) {
                                    return pgSelectFromRecord($result.resource, $result.record());
                                }
                                else {
                                    const spec = pkAttributes.reduce((memo, attributeName) => {
                                        memo[attributeName] = $result.get(attributeName);
                                        return memo;
                                    }, Object.create(null));
                                    return resource.find(spec);
                                }
                            })();
                            fieldArgs.apply($select, "orderBy");
                            const $connection = connection($select);
                            // NOTE: you must not use `$single = $select.single()`
                            // here because doing so will mark the row as unique, and
                            // then the ordering logic (and thus cursor) will differ.
                            const $single = $select.row(first($select));
                            return new EdgeStep($connection, $single);
                        }, [
                            grafast_1.EdgeStep,
                            pg_1.PgDeleteSingleStep,
                            grafast_1.connection,
                            grafast_1.constant,
                            grafast_1.first,
                            pg_1.pgSelectFromRecord,
                            pkAttributes,
                            resource,
                        ]),
                    })),
                }, `Adding edge field for table ${pgCodec.name} to mutation payload '${Self.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgMutationPayloadEdgePlugin.js.map