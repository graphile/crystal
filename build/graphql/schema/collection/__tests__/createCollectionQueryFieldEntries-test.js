"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
jest.mock('../../../utils/idSerde');
jest.mock('../../connection/createConnectionGqlField');
jest.mock('../getCollectionGqlType');
const graphql_1 = require('graphql');
const createConnectionGqlField_1 = require('../../connection/createConnectionGqlField');
const getCollectionGqlType_1 = require('../getCollectionGqlType');
const createCollectionQueryFieldEntries_1 = require('../createCollectionQueryFieldEntries');
test('will create no entries for a collection with no keys and no paginator', () => {
    const fieldEntries = createCollectionQueryFieldEntries_1.default({}, { name: 'foo' });
    expect(fieldEntries.length).toEqual(0);
});
test('will create a connection when there is a paginator', () => {
    const buildToken = Symbol('buildToken');
    const paginator = Symbol('paginator');
    const fieldEntries = createCollectionQueryFieldEntries_1.default(buildToken, { name: 'foo', type: { fields: new Map() }, paginator });
    expect(fieldEntries.length).toEqual(1);
    expect(fieldEntries[0][0]).toEqual('allFoo');
    expect(createConnectionGqlField_1.default.mock.calls.length).toEqual(1);
    expect(createConnectionGqlField_1.default.mock.calls[0].length).toEqual(3);
    expect(createConnectionGqlField_1.default.mock.calls[0][0]).toBe(buildToken);
    expect(createConnectionGqlField_1.default.mock.calls[0][1]).toBe(paginator);
});
test('will create no entries if there is a primary key with no read method', () => {
    const fieldEntries = createCollectionQueryFieldEntries_1.default({}, { name: 'foo', primaryKey: {} });
    expect(fieldEntries.length).toEqual(0);
});
test('will create a primary key field entry if the primary key has a read method', () => __awaiter(this, void 0, void 0, function* () {
    const collectionGqlType = Symbol('collectionGqlType');
    getCollectionGqlType_1.default.mockReturnValueOnce(collectionGqlType);
    const collection = { name: 'foo', type: { name: 'bar' } };
    const readValue = Symbol('readValue');
    const primaryKey = { collection, read: jest.fn(() => Promise.resolve(readValue)) };
    collection.primaryKey = primaryKey;
    const nodeIdFieldName = 'abc';
    const inventory = Symbol('inventory');
    const buildToken = { options: { nodeIdFieldName }, inventory };
    const fieldEntries = createCollectionQueryFieldEntries_1.default(buildToken, collection);
    expect(fieldEntries.length).toEqual(1);
    expect(fieldEntries[0][0]).toEqual('bar');
    expect(fieldEntries[0][1].type).toBe(collectionGqlType);
    expect(Object.keys(fieldEntries[0][1].args)).toEqual([nodeIdFieldName]);
    expect(fieldEntries[0][1].args[nodeIdFieldName].type).toEqual(new graphql_1.GraphQLNonNull(graphql_1.GraphQLID));
    expect(getCollectionGqlType_1.default.mock.calls).toEqual([[buildToken, collection]]);
    const resolve = fieldEntries[0][1].resolve;
    // const context = new Context()
    // const idValue = Symbol('idValue')
    // const keyValue = Symbol('keyValue')
    // idSerde.deserialize.mockReturnValueOnce({ collection: collection, keyValue })
    // expect(await resolve(null, { [nodeIdFieldName]: idValue }, context)).toEqual(readValue)
    // idSerde.deserialize.mockReturnValueOnce({ collection: { name: 'xyz' }, keyValue })
    // expect((await resolve(null, { [nodeIdFieldName]: idValue }, context).then(() => { throw new Error('Unexpected') }, error => error)).message).toEqual('The provided id is for collection \'xyz\', not the expected collection \'foo\'.')
    // expect(idSerde.deserialize.mock.calls).toEqual([[inventory, idValue], [inventory, idValue]])
    // expect(primaryKey.read.mock.calls).toEqual([[context, keyValue]])
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvblF1ZXJ5RmllbGRFbnRyaWVzLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvY29sbGVjdGlvbi9fX3Rlc3RzX18vY3JlYXRlQ29sbGVjdGlvblF1ZXJ5RmllbGRFbnRyaWVzLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtBQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFFcEMsMEJBQTBDLFNBQzFDLENBQUMsQ0FEa0Q7QUFHbkQsMkNBQXFDLDJDQUNyQyxDQUFDLENBRCtFO0FBQ2hGLHVDQUFpQyx5QkFDakMsQ0FBQyxDQUR5RDtBQUMxRCxvREFBOEMsc0NBRTlDLENBQUMsQ0FGbUY7QUFFcEYsSUFBSSxDQUFDLHVFQUF1RSxFQUFFO0lBQzVFLE1BQU0sWUFBWSxHQUFHLDJDQUFpQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQzNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLG9EQUFvRCxFQUFFO0lBQ3pELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUN2QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDckMsTUFBTSxZQUFZLEdBQUcsMkNBQWlDLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxF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