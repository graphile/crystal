"use strict";
var graphql_1 = require("graphql");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
var getNodeInterfaceType_1 = require("../node/getNodeInterfaceType");
var createConnectionGqlField_1 = require("../connection/createConnectionGqlField");
var createCollectionRelationTailGqlFieldEntries_1 = require("./createCollectionRelationTailGqlFieldEntries");
var getConditionGqlType_1 = require("./getConditionGqlType");
var lodash_1 = require("lodash");
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
                    externalFieldNameDependencies: primaryKey._keyTypeFields.map(function (_a) {
                        var fieldName = _a[0], field = _a[1];
                        return field.externalFieldName;
                    }),
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
                    externalFieldName: field.externalFieldName,
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
                    getPaginatorInput: function (sourceOrAliasIdentifier, args) {
                        return interface_1.conditionHelpers.and(lodash_1.isSymbol(sourceOrAliasIdentifier)
                            ? relation.getTailConditionFromHeadAlias(sourceOrAliasIdentifier)
                            : relation.getTailConditionFromHeadValue(sourceOrAliasIdentifier), conditionFromGqlInput(args.condition));
                    },
                    subquery: true,
                    relation: relation,
                }),
            ];
        })); },
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvbkdxbFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvY29sbGVjdGlvbi9jcmVhdGVDb2xsZWN0aW9uR3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQTBGO0FBQzFGLGdEQUFrRztBQUNsRyxxQ0FBOEQ7QUFDOUQsNkRBQXVEO0FBQ3ZELHFFQUErRDtBQUMvRCxtRkFBNkU7QUFFN0UsNkdBQXVHO0FBQ3ZHLDZEQUF1RDtBQUN2RCxpQ0FBaUM7QUFFakM7Ozs7R0FJRztBQUNILGlDQUNFLFVBQXNCLEVBQ3RCLFVBQThCO0lBRXRCLElBQUEsNEJBQU8sRUFBRSxnQ0FBUyxDQUFlO0lBQ2pDLElBQUEsc0JBQUksRUFBRSxrQ0FBVSxDQUFlO0lBQ3ZDLElBQU0sa0JBQWtCLEdBQUcsa0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRXJELE1BQU0sQ0FBQyxJQUFJLDJCQUFpQixDQUFDO1FBQzNCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXO1FBRW5DLDZDQUE2QztRQUM3QyxVQUFVLEVBQUUsVUFBVSxHQUFHLENBQUMsOEJBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFO1FBRWhFLHdFQUF3RTtRQUN4RSwyQ0FBMkM7UUFDM0MsTUFBTSxFQUFFLGNBQU0sT0FBQSxtQkFBVztRQUN2QixxRUFBcUU7UUFDckUsNENBQTRDO1FBQzVDO1lBQ0UsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtvQkFDdEMsV0FBVyxFQUFFLGtIQUFrSDtvQkFDL0gsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxtQkFBUyxDQUFDO29CQUNuQyw2QkFBNkIsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQWtCOzRCQUFqQixp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