"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgConnectionTotalCountPlugin = void 0;
require("./PgTablesPlugin.js");
require("./PgBasicsPlugin.js");
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgConnectionTotalCountPlugin = {
    name: "PgConnectionTotalCountPlugin",
    description: "Add 'totalCount' field to connections",
    version: version_js_1.version,
    schema: {
        behaviorRegistry: {
            add: {
                totalCount: {
                    description: "on a codec, should we add the totalCount field?",
                    entities: ["pgCodec"],
                },
            },
        },
        entityBehavior: {
            pgCodec: "totalCount",
        },
        hooks: {
            GraphQLObjectType_fields(fields, build, context) {
                const { extend, inflection, graphql: { GraphQLInt, GraphQLNonNull }, sql, } = build;
                const { scope: { isPgConnectionRelated, isConnectionType, pgCodec: codec }, fieldWithHooks, Self, } = context;
                if (!isPgConnectionRelated || !isConnectionType) {
                    return fields;
                }
                const nodeTypeName = codec
                    ? codec.attributes
                        ? inflection.tableType(codec)
                        : build.getGraphQLTypeNameByPgCodec(codec, "output")
                    : null;
                if (!nodeTypeName) {
                    return fields;
                }
                if (!build.behavior.pgCodecMatches(codec, "totalCount")) {
                    return fields;
                }
                return extend(fields, {
                    totalCount: fieldWithHooks({
                        fieldName: "totalCount",
                        fieldBehaviorScope: `totalCount`,
                        isPgConnectionTotalCountField: true,
                    }, () => {
                        return {
                            description: build.wrapDescription(`The count of *all* \`${nodeTypeName}\` you could get from the connection.`, "field"),
                            type: new GraphQLNonNull(GraphQLInt),
                            plan: (0, graphile_build_1.EXPORTABLE)((TYPES, sql) => ($connection) => $connection
                                .cloneSubplanWithoutPagination("aggregate")
                                .singleAsRecord()
                                .select(sql `count(*)`, TYPES.bigint, false), [pg_1.TYPES, sql]),
                        };
                    }),
                }, `Adding totalCount to connection '${Self.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgConnectionTotalCountPlugin.js.map