"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const graphql_1 = require('graphql');
const utils_1 = require('../../utils');
const createConnectionGqlField_1 = require('../connection/createConnectionGqlField');
const getCollectionGqlType_1 = require('./getCollectionGqlType');
const createCollectionKeyInputHelpers_1 = require('./createCollectionKeyInputHelpers');
const getConditionGqlType_1 = require('./getConditionGqlType');
/**
 * Creates any number of query field entries for a collection. These fields
 * will be on the root query type.
 */
function createCollectionQueryFieldEntries(buildToken, collection) {
    const type = collection.type;
    const entries = [];
    const primaryKey = collection.primaryKey;
    const paginator = collection.paginator;
    // If the collection has a paginator, let’s use it to create a connection
    // field for our collection.
    if (paginator) {
        const { gqlType: gqlConditionType, fromGqlInput: conditionFromGqlInput } = getConditionGqlType_1.default(buildToken, type);
        entries.push([
            utils_1.formatName.field(`all-${collection.name}`),
            createConnectionGqlField_1.default(buildToken, paginator, {
                // The one input arg we have for this connection is the `condition` arg.
                inputArgEntries: [
                    ['condition', {
                            description: 'A condition to be used in determining which values should be returned by the collection.',
                            type: gqlConditionType,
                        }],
                ],
                getPaginatorInput: (_headValue, args) => conditionFromGqlInput(args.condition),
            }),
        ]);
    }
    // Add a field to select our collection by its primary key, if the
    // collection has a primary key. Note that we abstract away the shape of
    // the primary key in this instance. Instead using a GraphQL native format,
    // the id format.
    if (primaryKey) {
        const field = createCollectionPrimaryKeyField(buildToken, primaryKey);
        // If we got a field back, add it.
        if (field)
            entries.push([utils_1.formatName.field(type.name), field]);
    }
    // Add a field to select any value in the collection by any key. So all
    // unique keys of an object will be usable to select a single value.
    for (const collectionKey of (collection.keys || [])) {
        const field = createCollectionKeyField(buildToken, collectionKey);
        // If we got a field back, add it.
        if (field)
            entries.push([utils_1.formatName.field(`${type.name}-by-${collectionKey.name}`), field]);
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
    const { options, inventory } = buildToken;
    const { collection, keyType } = collectionKey;
    // If we can’t read from this collection key, stop.
    if (collectionKey.read == null)
        return;
    const collectionType = getCollectionGqlType_1.default(buildToken, collection);
    return {
        description: `Reads a single ${utils_1.scrib.type(collectionType)} using its globally unique ${utils_1.scrib.type(graphql_1.GraphQLID)}.`,
        type: collectionType,
        args: {
            [options.nodeIdFieldName]: {
                description: `The globally unique ${utils_1.scrib.type(graphql_1.GraphQLID)} to be used in selecting a single ${utils_1.scrib.type(collectionType)}.`,
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
            },
        },
        resolve(_source, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = utils_1.idSerde.deserialize(inventory, args[options.nodeIdFieldName]);
                if (result.collection !== collection)
                    throw new Error(`The provided id is for collection '${result.collection.name}', not the expected collection '${collection.name}'.`);
                if (!keyType.isTypeOf(result.keyValue))
                    throw new Error(`The provided id is not of the correct type.`);
                return yield collectionKey.read(context, result.keyValue);
            });
        },
    };
}
/**
 * Creates a field using the value from any collection key.
 */
// TODO: test
function createCollectionKeyField(buildToken, collectionKey) {
    // If we can’t read from this collection key, stop.
    if (collectionKey.read == null)
        return;
    const { collection } = collectionKey;
    const collectionType = getCollectionGqlType_1.default(buildToken, collection);
    const inputHelpers = createCollectionKeyInputHelpers_1.default(buildToken, collectionKey);
    return {
        type: collectionType,
        args: utils_1.buildObject(inputHelpers.fieldEntries),
        resolve(_source, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = inputHelpers.getKey(args);
                return yield collectionKey.read(context, key);
            });
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvblF1ZXJ5RmllbGRFbnRyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2NvbGxlY3Rpb24vY3JlYXRlQ29sbGVjdGlvblF1ZXJ5RmllbGRFbnRyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBCQUE4RCxTQUM5RCxDQUFDLENBRHNFO0FBRXZFLHdCQUF3RCxhQUN4RCxDQUFDLENBRG9FO0FBRXJFLDJDQUFxQyx3Q0FDckMsQ0FBQyxDQUQ0RTtBQUM3RSx1Q0FBaUMsd0JBQ2pDLENBQUMsQ0FEd0Q7QUFDekQsa0RBQTRDLG1DQUM1QyxDQUFDLENBRDhFO0FBQy9FLHNDQUFnQyx1QkFNaEMsQ0FBQyxDQU5zRDtBQUV2RDs7O0dBR0c7QUFDSCwyQ0FDRSxVQUFzQixFQUN0QixVQUFzQjtJQUV0QixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFBO0lBQzVCLE1BQU0sT0FBTyxHQUFzRCxFQUFFLENBQUE7SUFDckUsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQTtJQUN4QyxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFBO0lBRXRDLHlFQUF5RTtJQUN6RSw0QkFBNEI7SUFDNUIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNkLE1BQU0sRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsNkJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ2hILE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDWCxrQkFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMxQyxrQ0FBd0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO2dCQUM5Qyx3RUFBd0U7Z0JBQ3hFLGVBQWUsRUFBRTtv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