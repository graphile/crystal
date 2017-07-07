"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
var getNodeInterfaceType_1 = require("../node/getNodeInterfaceType");
var createConnectionGqlField_1 = require("../connection/createConnectionGqlField");
var createCollectionRelationTailGqlFieldEntries_1 = require("./createCollectionRelationTailGqlFieldEntries");
var getConditionGqlType_1 = require("./getConditionGqlType");
/**
 * Creates the output object type for a collection. This type will include all
 * of the fields in the object, as well as an id field, computed columns, and
 * relations (head and tail).
 */
function createCollectionGqlType(buildToken, collection) {
    var options = buildToken.options, inventory = buildToken.inventory;
    var type = collection.type, primaryKey = collection.primaryKey;
    var collectionTypeName = utils_1.formatName.type(type.name);
    return new graphql_1.GraphQLObjectType({
        name: collectionTypeName,
        description: collection.description,
        // If there is a primary key, this is a node.
        interfaces: primaryKey ? [getNodeInterfaceType_1.default(buildToken)] : [],
        // We make `fields` here a thunk because we don’t want to eagerly create
        // types for collections used in this type.
        fields: function () { return utils_1.buildObject(
        // Our id field. It is powered by the collection’s primary key. If we
        // have no primary key, we have no id field.
        [
            primaryKey && [options.nodeIdFieldName, {
                    description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    resolve: function (value) { return utils_1.idSerde.serialize(collection, value); },
                }],
        ], 
        // Add all of the basic fields to our type.
        Array.from(type.fields).map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            var _b = getGqlOutputType_1.default(buildToken, field.type), gqlType = _b.gqlType, intoGqlOutput = _b.intoGqlOutput;
            return {
                key: utils_1.formatName.field(fieldName),
                value: {
                    description: field.description,
                    type: gqlType,
                    resolve: function (value) { return intoGqlOutput(field.getValue(value)); },
                },
            };
        }), 
        // Add extra fields that may exist in our hooks.
        buildToken._hooks.objectTypeFieldEntries
            ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
            : [], 
        // Add fields from relations where this collection is the tail.
        createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection, { getCollectionValue: function (value) { return value; } }), 
        // Add all of our one-to-many relations (aka head relations).
        inventory.getRelations()
            .filter(function (relation) { return relation.headCollectionKey.collection === collection; })
            .map(function (relation) {
            var tailCollection = relation.tailCollection;
            var tailPaginator = tailCollection.paginator;
            // If there is no tail paginator, or the relation cannot get a
            // condition for that paginator we can’t provide this field so
            // return null.
            if (!tailPaginator || !relation.getTailConditionFromHeadValue)
                return null;
            var _a = getConditionGqlType_1.default(buildToken, tailCollection.type), gqlConditionType = _a.gqlType, conditionFromGqlInput = _a.fromGqlInput;
            return [
                utils_1.formatName.field(tailCollection.name + "-by-" + relation.name),
                createConnectionGqlField_1.default(buildToken, tailPaginator, {
                    // The one input arg we have for this connection is the `condition` arg.
                    inputArgEntries: [
                        ['condition', {
                                description: 'A condition to be used in determining which values should be returned by the collection.',
                                type: gqlConditionType,
                            }],
                    ],
                    // We use the config when creating a connection field to inject
                    // a condition that limits what we select from the paginator.
                    getPaginatorInput: function (headValue, args) {
                        return interface_1.conditionHelpers.and(relation.getTailConditionFromHeadValue(headValue), conditionFromGqlInput(args.condition));
                    },
                }),
            ];
        })); },
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvbkdxbFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvY29sbGVjdGlvbi9jcmVhdGVDb2xsZWN0aW9uR3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQTBGO0FBQzFGLGdEQUFrRztBQUNsRyxxQ0FBOEQ7QUFDOUQsNkRBQXVEO0FBQ3ZELHFFQUErRDtBQUMvRCxtRkFBNkU7QUFFN0UsNkdBQXVHO0FBQ3ZHLDZEQUF1RDtBQUV2RDs7OztHQUlHO0FBQ0gsaUNBQ0UsVUFBc0IsRUFDdEIsVUFBOEI7SUFFdEIsSUFBQSw0QkFBTyxFQUFFLGdDQUFTLENBQWU7SUFDakMsSUFBQSxzQkFBSSxFQUFFLGtDQUFVLENBQWU7SUFDdkMsSUFBTSxrQkFBa0IsR0FBRyxrQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFckQsTUFBTSxDQUFDLElBQUksMkJBQWlCLENBQUM7UUFDM0IsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixXQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVc7UUFFbkMsNkNBQTZDO1FBQzdDLFVBQVUsRUFBRSxVQUFVLEdBQUcsQ0FBQyw4QkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUU7UUFFaEUsd0VBQXdFO1FBQ3hFLDJDQUEyQztRQUMzQyxNQUFNLEVBQUUsY0FBTSxPQUFBLG1CQUFXO1FBQ3ZCLHFFQUFxRTtRQUNyRSw0Q0FBNEM7UUFDNUM7WUFDRSxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO29CQUN0QyxXQUFXLEVBQUUsa0hBQWtIO29CQUMvSCxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLG1CQUFTLENBQUM7b0JBQ25DLE9BQU8sRUFBRSxVQUFDLEtBQWEsSUFBSyxPQUFBLGVBQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFw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