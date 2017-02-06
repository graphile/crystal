"use strict";
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
var createConnectionGqlField_1 = require("../connection/createConnectionGqlField");
var createCollectionKeyInputHelpers_1 = require("./createCollectionKeyInputHelpers");
var getConditionGqlType_1 = require("./getConditionGqlType");
/**
 * Creates any number of query field entries for a collection. These fields
 * will be on the root query type.
 */
function createCollectionQueryFieldEntries(buildToken, collection) {
    var type = collection.type;
    var entries = [];
    var primaryKey = collection.primaryKey;
    var paginator = collection.paginator;
    // If the collection has a paginator, let’s use it to create a connection
    // field for our collection.
    if (paginator) {
        var _a = getConditionGqlType_1.default(buildToken, type), gqlConditionType = _a.gqlType, conditionFromGqlInput_1 = _a.fromGqlInput;
        entries.push([
            utils_1.formatName.field("all-" + collection.name),
            createConnectionGqlField_1.default(buildToken, paginator, {
                // The one input arg we have for this connection is the `condition` arg.
                inputArgEntries: [
                    ['condition', {
                            description: 'A condition to be used in determining which values should be returned by the collection.',
                            type: gqlConditionType,
                        }],
                ],
                getPaginatorInput: function (_headValue, args) {
                    return conditionFromGqlInput_1(args.condition);
                },
            }),
        ]);
    }
    // Add a field to select our collection by its primary key, if the
    // collection has a primary key. Note that we abstract away the shape of
    // the primary key in this instance. Instead using a GraphQL native format,
    // the id format.
    if (primaryKey) {
        var field = createCollectionPrimaryKeyField(buildToken, primaryKey);
        // If we got a field back, add it.
        if (field)
            entries.push([utils_1.formatName.field(type.name), field]);
    }
    // Add a field to select any value in the collection by any key. So all
    // unique keys of an object will be usable to select a single value.
    for (var _i = 0, _b = (collection.keys || []); _i < _b.length; _i++) {
        var collectionKey = _b[_i];
        var field = createCollectionKeyField(buildToken, collectionKey);
        // If we got a field back, add it.
        if (field)
            entries.push([utils_1.formatName.field(type.name + "-by-" + collectionKey.name), field]);
    }
    return entries;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionQueryFieldEntries;
/**
 * Creates the field used to select an object by its primary key using a
 * GraphQL global id.
 */
function createCollectionPrimaryKeyField(buildToken, collectionKey) {
    var options = buildToken.options, inventory = buildToken.inventory;
    var collection = collectionKey.collection, keyType = collectionKey.keyType;
    // If we can’t read from this collection key, stop.
    if (collectionKey.read == null)
        return;
    var _a = getGqlOutputType_1.default(buildToken, new interface_1.NullableType(collection.type)), collectionGqlType = _a.gqlType, intoGqlOutput = _a.intoGqlOutput;
    return {
        description: "Reads a single " + utils_1.scrib.type(collectionGqlType) + " using its globally unique " + utils_1.scrib.type(graphql_1.GraphQLID) + ".",
        type: collectionGqlType,
        args: (_b = {},
            _b[options.nodeIdFieldName] = {
                description: "The globally unique " + utils_1.scrib.type(graphql_1.GraphQLID) + " to be used in selecting a single " + utils_1.scrib.type(collectionGqlType) + ".",
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
            },
            _b),
        resolve: function (_source, args, context, resolveInfo) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var result, value;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = utils_1.idSerde.deserialize(inventory, args[options.nodeIdFieldName]);
                            if (result.collection !== collection)
                                throw new Error("The provided id is for collection '" + result.collection.name + "', not the expected collection '" + collection.name + "'.");
                            if (!keyType.isTypeOf(result.keyValue))
                                throw new Error("The provided id is not of the correct type.");
                            return [4 /*yield*/, collectionKey.read(context, result.keyValue, resolveInfo, collectionGqlType)];
                        case 1:
                            value = _a.sent();
                            if (value == null)
                                return [2 /*return*/];
                            return [2 /*return*/, intoGqlOutput(value)];
                    }
                });
            });
        },
    };
    var _b;
}
/**
 * Creates a field using the value from any collection key.
 */
// TODO: test
function createCollectionKeyField(buildToken, collectionKey) {
    // If we can’t read from this collection key, stop.
    if (collectionKey.read == null)
        return;
    var collection = collectionKey.collection;
    var _a = getGqlOutputType_1.default(buildToken, new interface_1.NullableType(collection.type)), collectionGqlType = _a.gqlType, intoGqlOutput = _a.intoGqlOutput;
    var inputHelpers = createCollectionKeyInputHelpers_1.default(buildToken, collectionKey);
    return {
        type: collectionGqlType,
        args: utils_1.buildObject(inputHelpers.fieldEntries),
        resolve: function (_source, args, context, resolveInfo) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var key, value;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = inputHelpers.getKeyFromInput(args);
                            return [4 /*yield*/, collectionKey.read(context, key, resolveInfo, collectionGqlType)];
                        case 1:
                            value = _a.sent();
                            if (value == null)
                                return [2 /*return*/];
                            return [2 /*return*/, intoGqlOutput(value)];
                    }
                });
            });
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvblF1ZXJ5RmllbGRFbnRyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2NvbGxlY3Rpb24vY3JlYXRlQ29sbGVjdGlvblF1ZXJ5RmllbGRFbnRyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXVFO0FBQ3ZFLGdEQUE0RTtBQUM1RSxxQ0FBcUU7QUFFckUsNkRBQXVEO0FBQ3ZELG1GQUE2RTtBQUM3RSxxRkFBK0U7QUFDL0UsNkRBQXVEO0FBRXZEOzs7R0FHRztBQUNILDJDQUNFLFVBQXNCLEVBQ3RCLFVBQThCO0lBRTlCLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUE7SUFDNUIsSUFBTSxPQUFPLEdBQXNELEVBQUUsQ0FBQTtJQUNyRSxJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFBO0lBQ3hDLElBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUE7SUFFdEMseUVBQXlFO0lBQ3pFLDRCQUE0QjtJQUM1QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ1IsSUFBQSxvREFBMEcsRUFBeEcsNkJBQXlCLEVBQUUseUNBQW1DLENBQTBDO1FBQ2hILE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDWCxrQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFPLFVBQVUsQ0FBQyxJQUFNLENBQUM7WUFDMUMsa0NBQXdCLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRTtnQkFDOUMsd0VBQXdFO2dCQUN4RSxlQUFlLEVBQUU7b0JBQ2YsQ0FBQyxXQUFXLEVBQUU7NEJBQ1osV0FBVyxFQUFFLDBGQUEwRjs0QkFDdkcsSUFBSSxFQUFFLGdCQUFnQjt5QkFDdkIsQ0FBQztpQkFDSDtnQkFDRCxpQkFBaUIsRUFBRSxVQUFDLFVBQWlCLEVBQUUsSUFBOEM7b0JBQ25GLE9BQUEsdUJBQXFCLENBQUMsSUFBSSxDQUFD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