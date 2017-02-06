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
var getSelectFragment_1 = require("../../../postgres/inventory/paginator/getSelectFragment");
/**
 * Creates the fields for query procedures. Query procedures that return
 * a set will expose a GraphQL connection.
 */
function createPgProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    return (pgProcedure.returnsSet
        ? createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure)
        : createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureQueryGqlFieldEntry;
/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments.
 */
function createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    var fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    var argEntries = fixtures.args.map(function (_a) {
        var name = _a.name, gqlType = _a.gqlType;
        return [utils_1.formatName.arg(name), {
                // No description…
                type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
            }];
    });
    return [utils_1.formatName.field(pgProcedure.name), {
            description: pgProcedure.description,
            type: fixtures.return.gqlType,
            args: utils_1.buildObject(argEntries),
            resolve: function (_source, args, context, resolveInfo) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var client, input, aliasIdentifier, query, row, _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                client = pgClientFromContext_1.default(context);
                                input = argEntries.map(function (_a, i) {
                                    var argName = _a[0];
                                    return fixtures.args[i].fromGqlInput(args[argName]);
                                });
                                aliasIdentifier = Symbol();
                                query = utils_2.sql.compile((_a = ["\n        select ", " as value,\n        (", " is null) as is_null\n        from ", " as ", "\n      "], _a.raw = ["\n        select ", " as value,\n        (", " is null) as is_null\n        from ", " as ", "\n      "], utils_2.sql.query(_a, getSelectFragment_1.default(resolveInfo, aliasIdentifier, fixtures.return.gqlType), utils_2.sql.identifier(aliasIdentifier), createPgProcedureSqlCall_1.default(fixtures, input), utils_2.sql.identifier(aliasIdentifier))));
                                return [4 /*yield*/, client.query(query)];
                            case 1:
                                row = (_b.sent()).rows[0];
                                return [2 /*return*/, row && !row['is_null'] ? fixtures.return.intoGqlOutput(fixtures.return.type.transformPgValueIntoValue(row['value'])) : null];
                        }
                    });
                });
            },
        }];
}
/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination.
 */
function createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    var fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    var paginator = new PgProcedurePaginator_1.default(fixtures);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    var inputArgEntries = fixtures.args.map(function (_a) {
        var name = _a.name, gqlType = _a.gqlType;
        return [utils_1.formatName.arg(name), {
                // No description…
                type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
            }];
    });
    return [
        utils_1.formatName.field(pgProcedure.name),
        createConnectionGqlField_1.default(buildToken, paginator, {
            description: pgProcedure.description,
            inputArgEntries: inputArgEntries,
            getPaginatorInput: function (_source, args) {
                return inputArgEntries.map(function (_a, i) {
                    var argName = _a[0];
                    return fixtures.args[i].fromGqlInput(args[argName]);
                });
            },
        }),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVRdWVyeUdxbEZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvY3JlYXRlUGdQcm9jZWR1cmVRdWVyeUdxbEZpZWxkRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBb0c7QUFDcEcsZ0RBQWdFO0FBRWhFLHdHQUFrRztBQUNsRyxpREFBNkM7QUFFN0MsdUZBQWlGO0FBQ2pGLHlFQUFtRTtBQUNuRSx1RUFBaUU7QUFDakUsK0RBQXlEO0FBQ3pELDZGQUF1RjtBQUV2Rjs7O0dBR0c7QUFDSCw2Q0FDRSxVQUFzQixFQUN0QixTQUFvQixFQUNwQixXQUErQjtJQUUvQixNQUFNLENBQUMsQ0FDTCxXQUFXLENBQUMsVUFBVTtVQUNsQixzQ0FBc0MsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQztVQUMxRSx5Q0FBeUMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUNsRixDQUFBO0FBQ0gsQ0FBQzs7QUFWRCxzREFVQztBQUVEOzs7R0FHRztBQUNILG1EQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLElBQU0sUUFBUSxHQUFHLG1DQUF5QixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFFOUUsd0VBQXdFO0lBQ3hFLGFBQWE7SUFDYixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDbEMsVUFBQyxFQUFpQjtZQUFmLGNBQUksRUFBRSxvQkFBTztRQUNkLE9BQUEsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsa0JBQWtCO2dCQUNsQixJQUFJLEVBQUUsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFjLENBQUMseUJBQWUsQ0FBQyxPQUFPLENB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