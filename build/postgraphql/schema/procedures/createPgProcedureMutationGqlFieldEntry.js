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
        ? inventory.getCollections().find(function (collection) { return collection instanceof PgCollection_1.default && collection.pgClass.typeId === fixtures.return.pgType.id; })
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
            relatedGqlType: fixtures.return.gqlType,
            inputFields: inputFields,
            outputFields: [
                [utils_1.formatName.field(pgProcedure.returnsSet
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
            execute: function (context, gqlInput, resolveInfo) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var client, input, procedureCall, aliasIdentifier, query, rows, values, _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                client = pgClientFromContext_1.default(context);
                                input = inputFields.map(function (_a, i) {
                                    var fieldName = _a[0];
                                    return fixtures.args[i].fromGqlInput(gqlInput[fieldName]);
                                });
                                procedureCall = createPgProcedureSqlCall_1.default(fixtures, input);
                                aliasIdentifier = Symbol();
                                query = utils_2.sql.compile((_a = ["\n          select to_json(", ") as value\n          from ", " as ", "\n        "], _a.raw = ["\n          select to_json(", ") as value\n          from ", " as ", "\n        "], 
                                // Though it's tempting to do our familiar:
                                //
                                //   select ${getSelectFragment(resolveInfo, aliasIdentifier, fixtures.return.gqlType)} as value
                                //
                                // we *cannot* do this because it will break computed columns.
                                // The reason is that computed columns are marked as STABLE, which
                                // means that "within a single table scan it will consistently return
                                // the same result for the same argument values". Postgresql docs also
                                // note: "It is inappropriate for AFTER triggers that wish to query
                                // rows modified by the current command."
                                //
                                // Instead we fall back to the traditional to_json(...) and rely on the
                                // resolvers to check `source.has(attrName)` to fetch it using the old
                                // method if it wasn't fetched via subquery.
                                utils_2.sql.query(_a, utils_2.sql.identifier(aliasIdentifier), procedureCall, utils_2.sql.identifier(aliasIdentifier))));
                                return [4 /*yield*/, client.query(query)];
                            case 1:
                                rows = (_b.sent()).rows;
                                values = rows.map(function (_a) {
                                    var value = _a.value;
                                    return fixtures.return.type.transformPgValueIntoValue(value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVNdXRhdGlvbkdxbEZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvY3JlYXRlUGdQcm9jZWR1cmVNdXRhdGlvbkdxbEZpZWxkRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBdUM7QUFDdkMsbUNBTWdCO0FBQ2hCLGdEQUFxRDtBQUNyRCxnREFBbUQ7QUFFbkQseUZBQW1GO0FBQ25GLDhJQUF3STtBQUN4SSxpREFBNkM7QUFFN0Msb0ZBQThFO0FBQzlFLHVGQUFpRjtBQUNqRix5RUFBbUU7QUFDbkUsdUVBQWlFO0FBQ2pFLHdHQUFpSDtBQUVqSDs7O0dBR0c7QUFDSCxhQUFhO0FBQ2IsZ0RBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFdkIsSUFBQSxnQ0FBUyxDQUFlO0lBQ2hDLElBQU0sUUFBUSxHQUFHLG1DQUF5QixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFFOUUsNkVBQTZFO0lBQzdFLHlFQUF5RTtJQUN6RSxVQUFVO0lBQ1YsSUFBTSxZQUFZLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVTtVQUN4QyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsVUFBVSxZQUFZLHNCQUFZLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUE3RixDQUE2RixDQUFDO1VBQzVJLElBQUksQ0FBQTtJQUVSLHdFQUF3RTtJQUN4RSxhQUFhO0lBQ2IsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ25DLFVBQUMsRUFBaUI7WUFBZixjQUFJLEVBQUUsb0JBQU87UUFDZCxPQUFBLENBQUMsa0JBQVUs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