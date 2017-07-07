"use strict";
var tslib_1 = require("tslib");
var pluralize = require("pluralize");
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../../graphql/utils");
var createMutationGqlField_1 = require("../../../graphql/schema/createMutationGqlField");
var createCollectionRelationTailGqlFieldEntries_1 = require("../../../graphql/schema/collection/createCollectionRelationTailGqlFieldEntries");
var utils_2 = require("../../../postgres/utils");
var PgCollection_1 = require("../../../postgres/inventory/collection/PgCollection");
var pgClientFromContext_1 = require("../../../postgres/inventory/pgClientFromContext");
var createPgProcedureFixtures_1 = require("./createPgProcedureFixtures");
var createPgProcedureSqlCall_1 = require("./createPgProcedureSqlCall");
var createConnectionGqlField_1 = require("../../../graphql/schema/connection/createConnectionGqlField");
/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGqlField` utility from the `graphql` package to do so.
 */
// TODO: test
function createPgProcedureMutationGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    var inventory = buildToken.inventory;
    var fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    // See if the output type of this procedure is a single object, try to find a
    // `PgCollection` which has the same type. If it exists we add some extra
    // stuffs.
    var pgCollection = !pgProcedure.returnsSet
        ? inventory.getCollections().find(function (collection) { return (collection instanceof PgCollection_1.default &&
            fixtures.return !== null &&
            collection.pgClass.typeId === fixtures.return.pgType.id); })
        : null;
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    var inputFields = fixtures.args.map(function (_a) {
        var name = _a.name, gqlType = _a.gqlType;
        return [utils_1.formatName.field(name), {
                // No description…
                type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
            }];
    });
    return [utils_1.formatName.field(pgProcedure.name), createMutationGqlField_1.default(buildToken, {
            name: pgProcedure.name,
            description: pgProcedure.description,
            inputFields: inputFields,
            outputFields: [
                fixtures.return && [utils_1.formatName.field(pgProcedure.returnsSet
                        ? pluralize(getTypeFieldName(fixtures.return.type))
                        : getTypeFieldName(fixtures.return.type)), {
                        // If we are returning a set, we should wrap our type in a GraphQL
                        // list.
                        type: pgProcedure.returnsSet
                            ? new graphql_1.GraphQLList(fixtures.return.gqlType)
                            : fixtures.return.gqlType,
                        resolve: function (value) { return fixtures.return.intoGqlOutput(value); },
                    }],
                // An edge variant of the created value. Because we use cursor
                // based pagination, it is also helpful to get the cursor for the
                // value we just created (thus why this is in the form of an edge).
                // Also Relay 1 requires us to return the edge.
                //
                // We may deprecate this in the future if Relay 2 doesn’t need it.
                pgCollection && pgCollection.paginator && [utils_1.formatName.field(pgCollection.type.name + "-edge"), {
                        description: "An edge for the type. May be used by Relay 1.",
                        type: createConnectionGqlField_1.getEdgeGqlType(buildToken, pgCollection.paginator),
                        args: { orderBy: createConnectionGqlField_1.createOrderByGqlArg(buildToken, pgCollection.paginator) },
                        resolve: function (value, args) { return ({
                            paginator: pgCollection.paginator,
                            ordering: args['orderBy'],
                            cursor: null,
                            value: value,
                        }); },
                    }]
            ].concat((pgCollection ? createCollectionRelationTailGqlFieldEntries_1.default(buildToken, pgCollection, { getCollectionValue: function (value) { return value; } }) : [])),
            // Actually execute the procedure here.
            execute: function (context, gqlInput) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var client, input, procedureCall, aliasIdentifier, query, rows, values, _a, _b;
                    return tslib_1.__generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                client = pgClientFromContext_1.default(context);
                                input = inputFields.map(function (_a, i) {
                                    var fieldName = _a[0];
                                    return fixtures.args[i].fromGqlInput(gqlInput[fieldName]);
                                });
                                procedureCall = createPgProcedureSqlCall_1.default(fixtures, input);
                                aliasIdentifier = Symbol();
                                query = utils_2.sql.compile(
                                // If the procedure returns a set, we must select a set of values.
                                pgProcedure.returnsSet
                                    ? (_a = ["select to_json(", ") as value from ", " as ", ""], _a.raw = ["select to_json(", ") as value from ", " as ", ""], utils_2.sql.query(_a, utils_2.sql.identifier(aliasIdentifier), procedureCall, utils_2.sql.identifier(aliasIdentifier))) : (_b = ["select to_json(", ") as value"], _b.raw = ["select to_json(", ") as value"], utils_2.sql.query(_b, procedureCall)));
                                return [4 /*yield*/, client.query(query)];
                            case 1:
                                rows = (_c.sent()).rows;
                                values = rows.map(function (_a) {
                                    var value = _a.value;
                                    return fixtures.return !== null ? fixtures.return.type.transformPgValueIntoValue(value) : null;
                                });
                                // If we selected a set of values, return the full set. Otherwise only
                                // return the one we queried.
                                return [2 /*return*/, pgProcedure.returnsSet ? values : values[0]];
                        }
                    });
                });
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureMutationGqlFieldEntry;
/**
 * Gets the field name for any given type. Pluralizes the name of for item
 * types in list types.
 */
function getTypeFieldName(_type) {
    return interface_1.switchType(_type, {
        nullable: function (type) { return getTypeFieldName(type.nonNullType); },
        list: function (type) { return pluralize(getTypeFieldName(type.itemType)); },
        alias: function (type) { return type.name; },
        enum: function (type) { return type.name; },
        object: function (type) { return type.name; },
        scalar: function (type) { return type.name; },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVNdXRhdGlvbkdxbEZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvY3JlYXRlUGdQcm9jZWR1cmVNdXRhdGlvbkdxbEZpZWxkRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBdUM7QUFDdkMsbUNBTWdCO0FBQ2hCLGdEQUFxRDtBQUNyRCxnREFBbUQ7QUFFbkQseUZBQW1GO0FBQ25GLDhJQUF3STtBQUN4SSxpREFBNkM7QUFFN0Msb0ZBQThFO0FBQzlFLHVGQUFpRjtBQUNqRix5RUFBbUU7QUFDbkUsdUVBQWlFO0FBQ2pFLHdHQUFpSDtBQUVqSDs7O0dBR0c7QUFDSCxhQUFhO0FBQ2IsZ0RBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFdkIsSUFBQSxnQ0FBUyxDQUFlO0lBQ2hDLElBQU0sUUFBUSxHQUFHLG1DQUF5QixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFFOUUsNkVBQTZFO0lBQzdFLHlFQUF5RTtJQUN6RSxVQUFVO0lBQ1YsSUFBTSxZQUFZLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVTtVQUN4QyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsQ0FDOUMsVUFBVSxZQUFZLHNCQUFZO1lBQ2xDLFFBQVEsQ0FBQyxNQUFNLEtBQUssSUFBSTtZQUN4QixVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ3hELEVBSitDLENBSS9DLENBQUM7VUFDQSxJQUFJLENBQUE7SUFFUix3RUFBd0U7SUFDeEUsYUFBYTtJQUNiLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNuQyxVQUFDLEVBQWlC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