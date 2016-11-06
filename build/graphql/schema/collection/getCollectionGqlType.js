"use strict";
const graphql_1 = require('graphql');
const interface_1 = require('../../../interface');
const utils_1 = require('../../utils');
const getNodeInterfaceType_1 = require('../node/getNodeInterfaceType');
const createNodeFieldEntry_1 = require('../node/createNodeFieldEntry');
const getGqlType_1 = require('../getGqlType');
const createConnectionGqlField_1 = require('../connection/createConnectionGqlField');
const createCollectionRelationTailGqlFieldEntries_1 = require('./createCollectionRelationTailGqlFieldEntries');
const getConditionGqlType_1 = require('./getConditionGqlType');
// Private implementation of `getCollectionGqlType`, types aren’t that great.
const _getCollectionGqlType = utils_1.memoize2(createCollectionGqlType);
/**
 * Creates the output object type for a collection. This type will include all
 * of the fields in the object, as well as an id field, computed columns, and
 * relations (head and tail).
 */
function getCollectionGqlType(buildToken, collection) {
    return _getCollectionGqlType(buildToken, collection);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getCollectionGqlType;
/**
 * The private non-memoized implementation of `getCollectionGqlType`.
 *
 * @private
 */
function createCollectionGqlType(buildToken, collection) {
    const { options, inventory } = buildToken;
    const { type, primaryKey } = collection;
    const collectionTypeName = utils_1.formatName.type(type.name);
    return new graphql_1.GraphQLObjectType({
        name: collectionTypeName,
        description: collection.description,
        // Determines the type of this value. If it came from our `node` field
        // then that field gave it some extra information about the collection
        // it came from so we must check that extra information.
        isTypeOf: value => (value != null && typeof value[createNodeFieldEntry_1.$$nodeValueCollection] !== 'undefined'
            ? value[createNodeFieldEntry_1.$$nodeValueCollection] === collection
            : true) && type.isTypeOf(value),
        // If there is a primary key, this is a node.
        interfaces: primaryKey ? [getNodeInterfaceType_1.default(buildToken)] : [],
        // We make `fields` here a thunk because we don’t want to eagerly create
        // types for collections used in this type.
        fields: () => utils_1.buildObject(
        // Our id field. It is powered by the collection’s primary key. If we
        // have no primary key, we have no id field.
        [
            primaryKey && [options.nodeIdFieldName, {
                    description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                    resolve: value => utils_1.idSerde.serialize(collection, value),
                }],
        ], 
        // Add all of the basic fields to our type.
        Array.from(type.fields.entries())
            .map(([fieldName, field]) => [utils_1.formatName.field(fieldName), {
                description: field.description,
                type: getGqlType_1.default(buildToken, field.type, false),
                resolve: value => 
                // Since we get `mixed` back here from the map, we’re just going
                // to assume the type is ok instead of running an `isTypeOf`
                // check. Generally `isTypeOf` isn’t super efficient so we only
                // use it on user input.
                // tslint:disable-next-line no-any
                value.get(fieldName),
            }]), 
        // Add extra fields that may exist in our hooks.
        buildToken._hooks.objectTypeFieldEntries
            ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
            : [], 
        // Add fields from relations where this collection is the tail.
        createCollectionRelationTailGqlFieldEntries_1.default(buildToken, collection), 
        // Add all of our one-to-many relations (aka head relations).
        inventory.getRelations()
            .filter(relation => relation.headCollectionKey.collection === collection)
            .map((relation) => {
            const tailCollection = relation.tailCollection;
            const tailPaginator = tailCollection.paginator;
            // If there is no tail paginator, or the relation cannot get a
            // condition for that paginator we can’t provide this field so
            // return null.
            if (!tailPaginator || !relation.getTailConditionFromHeadValue)
                return null;
            const { gqlType: gqlConditionType, fromGqlInput: conditionFromGqlInput } = getConditionGqlType_1.default(buildToken, tailCollection.type);
            return [
                utils_1.formatName.field(`${tailCollection.name}-by-${relation.name}`),
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
                    getPaginatorInput: (headValue, args) => interface_1.conditionHelpers.and(relation.getTailConditionFromHeadValue(headValue), conditionFromGqlInput(args.condition)),
                }),
            ];
        })),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q29sbGVjdGlvbkdxbFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvY29sbGVjdGlvbi9nZXRDb2xsZWN0aW9uR3FsVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQW9HLFNBQ3BHLENBQUMsQ0FENEc7QUFDN0csNEJBQThFLG9CQUM5RSxDQUFDLENBRGlHO0FBQ2xHLHdCQUEyRCxhQUMzRCxDQUFDLENBRHVFO0FBQ3hFLHVDQUFpQyw4QkFDakMsQ0FBQyxDQUQ4RDtBQUMvRCx1Q0FBc0MsOEJBQ3RDLENBQUMsQ0FEbUU7QUFDcEUsNkJBQXVCLGVBQ3ZCLENBQUMsQ0FEcUM7QUFDdEMsMkNBQXFDLHdDQUNyQyxDQUFDLENBRDRFO0FBRTdFLDhEQUF3RCwrQ0FDeEQsQ0FBQyxDQURzRztBQUN2RyxzQ0FBZ0MsdUJBR2hDLENBQUMsQ0FIc0Q7QUFFdkQsNkVBQTZFO0FBQzdFLE1BQU0scUJBQXFCLEdBQUcsZ0JBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBRS9EOzs7O0dBSUc7QUFDSCw4QkFBdUMsVUFBc0IsRUFBRSxVQUFzQjtJQUNuRixNQUFNLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ3RELENBQUM7QUFFRDtrQkFBZSxvQkFBb0IsQ0FBQTtBQUVuQzs7OztHQUlHO0FBQ0gsaUNBQWtDLFVBQXNCLEVBQUUsVUFBc0I7SUFDOUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFDekMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFDdkMsTUFBTSxrQkFBa0IsR0FBRyxrQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFckQsTUFBTSxDQUFDLElBQUksMkJBQWlCLENBQW1CO1FBQzdDLElBQUksRUFBRSxr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