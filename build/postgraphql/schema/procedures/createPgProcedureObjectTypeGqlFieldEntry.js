"use strict";
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var utils_1 = require("../../../graphql/utils");
var createConnectionGqlField_1 = require("../../../graphql/schema/connection/createConnectionGqlField");
var utils_2 = require("../../../postgres/utils");
var pgClientFromContext_1 = require("../../../postgres/inventory/pgClientFromContext");
var createPgProcedureFixtures_1 = require("./createPgProcedureFixtures");
var createPgProcedureSqlCall_1 = require("./createPgProcedureSqlCall");
var PgProcedurePaginator_1 = require("./PgProcedurePaginator");
/**
 * Creates a procedure field for a given object type. We assume that the type
 * of the source is the correct type.
 */
// TODO: This is almost a straight copy/paste of
// `createPgProcedureQueryGqlFieldEntries`. Refactor these hooks man!
function createPgProcedureObjectTypeGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    return (pgProcedure.returnsSet
        ? createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure)
        : createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureObjectTypeGqlFieldEntry;
/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments, and the source object as the first
 * argument.
 */
function createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    var fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    var argEntries = fixtures.args.slice(1).map(function (_a) {
        var name = _a.name, gqlType = _a.gqlType;
        return [utils_1.formatName.arg(name), {
                // No description…
                type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
            }];
    });
    var fieldName = utils_1.formatName.field(pgProcedure.name.substring(fixtures.args[0].pgType.name.length + 1));
    var sourceName = function (_tbl, _fld, args, alias) { return fieldName + "###" + (alias || ''); };
    return [fieldName, {
            description: pgProcedure.description,
            type: fixtures.return.gqlType,
            args: utils_1.buildObject(argEntries),
            sourceName: sourceName,
            sqlExpression: function (aliasIdentifier, gqlFieldName, args, context) {
                var input = [aliasIdentifier].concat(argEntries.map(function (_a, i) {
                    var argName = _a[0];
                    return fixtures.args[i + 1].fromGqlInput(args[argName]);
                }));
                return (_a = ["(", ")"], _a.raw = ["(", ")"], utils_2.sql.query(_a, createPgProcedureSqlCall_1.default(fixtures, input, true)));
                var _a;
            },
            resolve: function (source, args, context, resolveInfo) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var fieldNodes, alias, attrName, value, client, input, query, row, _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                fieldNodes = resolveInfo.fieldNodes || resolveInfo.fieldASTs;
                                alias = fieldNodes[0].alias && fieldNodes[0].alias.value;
                                attrName = sourceName(null, null, args, alias);
                                if (!source.has(attrName)) return [3 /*break*/, 1];
                                value = source.get(attrName);
                                return [2 /*return*/, value != null ? fixtures.return.intoGqlOutput(fixtures.return.type.transformPgValueIntoValue(value)) : null];
                            case 1:
                                client = pgClientFromContext_1.default(context);
                                input = [source].concat(argEntries.map(function (_a, i) {
                                    var argName = _a[0];
                                    return fixtures.args[i + 1].fromGqlInput(args[argName]);
                                }));
                                query = utils_2.sql.compile((_a = ["select to_json(", ") as value"], _a.raw = ["select to_json(", ") as value"], utils_2.sql.query(_a, createPgProcedureSqlCall_1.default(fixtures, input))));
                                return [4 /*yield*/, client.query(query)];
                            case 2:
                                row = (_b.sent()).rows[0];
                                return [2 /*return*/, row ? fixtures.return.intoGqlOutput(fixtures.return.type.transformPgValueIntoValue(row['value'])) : null];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            },
        }];
}
/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination with the
 * source argument as the first argument.
 */
function createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    var fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    var paginator = new PgProcedurePaginator_1.default(fixtures);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    var inputArgEntries = fixtures.args.slice(1).map(function (_a) {
        var name = _a.name, gqlType = _a.gqlType;
        return [utils_1.formatName.arg(name), {
                // No description…
                type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
            }];
    });
    return [utils_1.formatName.field(pgProcedure.name.substring(fixtures.args[0].pgType.name.length + 1)), createConnectionGqlField_1.default(buildToken, paginator, {
            description: pgProcedure.description,
            inputArgEntries: inputArgEntries,
            getPaginatorInput: function (source, args) {
                return [source].concat(inputArgEntries.map(function (_a, i) {
                    var argName = _a[0];
                    return fixtures.args[i + 1].fromGqlInput(args[argName]);
                }));
            },
            subquery: true,
        })];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVPYmplY3RUeXBlR3FsRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvcHJvY2VkdXJlcy9jcmVhdGVQZ1Byb2NlZHVyZU9iamVjdFR5cGVHcWxGaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW9HO0FBQ3BHLGdEQUFnRTtBQUVoRSx3R0FBa0c7QUFDbEcsaURBQTZDO0FBRTdDLHVGQUFpRjtBQUNqRix5RUFBbUU7QUFDbkUsdUVBQWlFO0FBQ2pFLCtEQUF5RDtBQUV6RDs7O0dBR0c7QUFDSCxnREFBZ0Q7QUFDaEQscUVBQXFFO0FBQ3JFLGtEQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLE1BQU0sQ0FBQyxDQUNMLFdBQVcsQ0FBQyxVQUFVO1VBQ2xCLHNDQUFzQyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDO1VBQzFFLHlDQUF5QyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQ2xGLENBQUE7QUFDSCxDQUFDOztBQVZELDJEQVVDO0FBRUQ7Ozs7R0FJRztBQUNILG1EQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLElBQU0sUUFBUSxHQUFHLG1DQUF5QixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFFOUUsd0VBQXdFO0lBQ3hFLGFBQWE7SUFDYixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQzNDLFVBQUMsRUFBaUI7WUFBZixjQUFJLEVBQUUsb0JBQU87UUFDZCxPQUFBLENBQUMsa0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLGtCQUFrQjtnQkFDbEIsSUFBSSxFQUFFLFdBQVcs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