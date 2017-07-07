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
    if (fixtures.return === null) {
        throw new Error('Procedures with a void return type are not allowed in GraphQL queries.');
    }
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
            resolve: function (_source, args, context) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var client, input, query, row, _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                client = pgClientFromContext_1.default(context);
                                input = argEntries.map(function (_a, i) {
                                    var argName = _a[0];
                                    return fixtures.args[i].fromGqlInput(args[argName]);
                                });
                                query = utils_2.sql.compile((_a = ["select to_json(", ") as value"], _a.raw = ["select to_json(", ") as value"], utils_2.sql.query(_a, createPgProcedureSqlCall_1.default(fixtures, input))));
                                return [4 /*yield*/, client.query(query)];
                            case 1:
                                row = (_b.sent()).rows[0];
                                return [2 /*return*/, row ? fixtures.return.intoGqlOutput(fixtures.return.type.transformPgValueIntoValue(row['value'])) : null];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVRdWVyeUdxbEZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvY3JlYXRlUGdQcm9jZWR1cmVRdWVyeUdxbEZpZWxkRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBb0c7QUFDcEcsZ0RBQWdFO0FBRWhFLHdHQUFrRztBQUNsRyxpREFBNkM7QUFFN0MsdUZBQWlGO0FBQ2pGLHlFQUFtRTtBQUNuRSx1RUFBaUU7QUFDakUsK0RBQXlEO0FBRXpEOzs7R0FHRztBQUNILDZDQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLE1BQU0sQ0FBQyxDQUNMLFdBQVcsQ0FBQyxVQUFVO1VBQ2xCLHNDQUFzQyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDO1VBQzFFLHlDQUF5QyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQ2xGLENBQUE7QUFDSCxDQUFDOztBQVZELHNEQVVDO0FBRUQ7OztHQUdHO0FBQ0gsbURBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFL0IsSUFBTSxRQUFRLEdBQUcsbUNBQXlCLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUU5RSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQyxDQUFBO0lBQzNGLENBQUM7SUFFRCx3RUFBd0U7SUFDeEUsYUFBYTtJQUNiLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNsQyxVQUFDLEVBQWlCO1lBQWYsY0FBSSxFQUFFLG9CQUFPO1FBQ2QsT0FBQSxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNyQixrQkFBa0I7Z0JBQ2xCLElBQUksRUFBRSxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQWMsQ0FBQyx5QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTzthQUNwRixDQUFDO0lBSEYsQ0FHRSxDQUNMLENBQUE7SUFFRCxNQUFNLENBQUMsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUFXO1lBQ3BDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU87WUFDN0IsSUFBSSxFQUFFLG1CQUFXLENBQUMsVUFBVSxDQUFDO1lBRXZCLE9BQU8sRUFBYixVQUFlLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTzs7d0JBQzdCLE1BQU0sRUFDTixLQUFLLEVBQ0wsS0FBSzs7Ozt5Q0FGSSw2QkFBbUIsQ0FBQyxPQUFPLENBQUM7d0NBQzdCLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFTLEVBQUUsQ0FBQzt3Q0FBWCxlQUFPO29DQUFTLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dDQUE1QyxDQUE0QyxDQUFDO3dDQUM5RSxXQUFHLENBQUMsT0FBTyxvREFBVSxpQkFBa0IsRUFBeUMsWUFBWSxHQUFoRixXQUFHLENBQUMsS0FBSyxLQUFrQixrQ0FBd0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQWE7Z0NBQ25GLHFCQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUE7O3NDQUF6QixDQUFBLFNBQXlCLENBQUE7Z0NBQ2pELHNCQUFPLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBQTs7OzthQUNsSDtTQUNGLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxnREFDRSxVQUFzQixFQUN0QixTQUFvQixFQUNwQixXQUErQjtJQUUvQixJQUFNLFFBQVEsR0FBRyxtQ0FBeUIsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0lBQzlFLElBQU0sU0FBUyxHQUFHLElBQUksOEJBQW9CLENBQUMsUUFBUSxDQUFDLENBQUE7SUFFcEQsd0VBQXdFO0lBQ3hFLGFBQWE7SUFDYixJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDdkMsVUFBQyxFQUFpQjtZQUFmLGNBQUksRUFBRSxvQkFBTztRQUNkLE9BQUEsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsa0JBQWtCO2dCQUNsQixJQUFJLEVBQUUsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFjLENBQUMseUJBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU87YUFDcEYsQ0FBQztJQUhGLENBR0UsQ0FDTCxDQUFBO0lBRUQsTUFBTSxDQUFDO1FBQ0wsa0JBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNsQyxrQ0FBd0IsQ0FBNkIsVUFBVSxFQUFFLFNBQVMsRUFBRTtZQUMxRSxXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVc7WUFDcEMsZUFBZSxpQkFBQTtZQUNmLGlCQUFpQixFQUFFLFVBQUMsT0FBTyxFQUFFLElBQUk7Z0JBQy9CLE9BQUEsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQVMsRUFBRSxDQUFDO3dCQUFYLGVBQU87b0JBQVMsT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQTVDLENBQTRDLENBQUM7WUFBbkYsQ0FBbUY7U0FDdEYsQ0FBQztLQUNILENBQUE7QUFDSCxDQUFDIn0=