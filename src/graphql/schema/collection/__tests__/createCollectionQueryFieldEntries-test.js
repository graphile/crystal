jest.mock('../../../utils/idSerde')
jest.mock('../../connection/createConnectionGQLField')
jest.mock('../getCollectionType')

import { GraphQLNonNull, GraphQLID } from 'graphql'
import { Context } from '../../../../interface'
import { personCollection, postCollection } from '../../../__tests__/fixtures/forumInventory'
import idSerde from '../../../utils/idSerde'
import createConnectionGQLField from '../../connection/createConnectionGQLField'
import getCollectionType from '../getCollectionType'
import createCollectionQueryFieldEntries from '../createCollectionQueryFieldEntries'

test('will create no entries for a collection with no keys and no paginator', () => {
  const fieldEntries = createCollectionQueryFieldEntries({}, { name: 'foo' })
  expect(fieldEntries.length).toEqual(0)
})

test('will create a connection when there is a paginator', () => {
  const buildToken = Symbol('buildToken')
  const paginator = Symbol('paginator')
  const fieldEntries = createCollectionQueryFieldEntries(buildToken, { name: 'foo', type: { fields: new Map() }, paginator })
  expect(fieldEntries.length).toEqual(1)
  expect(fieldEntries[0][0]).toEqual('allFoo')
  expect(createConnectionGQLField.mock.calls.length).toEqual(1)
  expect(createConnectionGQLField.mock.calls[0].length).toEqual(3)
  expect(createConnectionGQLField.mock.calls[0][0]).toBe(buildToken)
  expect(createConnectionGQLField.mock.calls[0][1]).toBe(paginator)
})

test('will create no entries if there is a primary key with no read method', () => {
  const fieldEntries = createCollectionQueryFieldEntries({}, { name: 'foo', primaryKey: {} })
  expect(fieldEntries.length).toEqual(0)
})

test('will create a primary key field entry if the primary key has a read method', async () => {
  const collectionGqlType = Symbol('collectionGqlType')
  getCollectionType.mockReturnValueOnce(collectionGqlType)
  const collection = { name: 'foo', type: { name: 'bar' } }
  const readValue = Symbol('readValue')
  const primaryKey = { collection, read: jest.fn(() => Promise.resolve(readValue)) }
  collection.primaryKey = primaryKey
  const nodeIdFieldName = 'abc'
  const inventory = Symbol('inventory')
  const buildToken = { options: { nodeIdFieldName }, inventory }
  const fieldEntries = createCollectionQueryFieldEntries(buildToken, collection)
  expect(fieldEntries.length).toEqual(1)
  expect(fieldEntries[0][0]).toEqual('bar')
  expect(fieldEntries[0][1].type).toBe(collectionGqlType)
  expect(Object.keys(fieldEntries[0][1].args)).toEqual([nodeIdFieldName])
  expect(fieldEntries[0][1].args[nodeIdFieldName].type).toEqual(new GraphQLNonNull(GraphQLID))
  expect(getCollectionType.mock.calls).toEqual([[buildToken, collection]])
  const resolve = fieldEntries[0][1].resolve
  const context = new Context()
  const idValue = Symbol('idValue')
  const keyValue = Symbol('keyValue')
  idSerde.deserialize.mockReturnValueOnce({ collection: collection, keyValue })
  expect(await resolve(null, { [nodeIdFieldName]: idValue }, context)).toEqual(readValue)
  idSerde.deserialize.mockReturnValueOnce({ collection: { name: 'xyz' }, keyValue })
  expect((await resolve(null, { [nodeIdFieldName]: idValue }, context).then(() => { throw new Error('Unexpected') }, error => error)).message).toEqual('The provided id is for collection \'xyz\', not the expected collection \'foo\'.')
  expect(idSerde.deserialize.mock.calls).toEqual([[inventory, idValue], [inventory, idValue]])
  expect(primaryKey.read.mock.calls).toEqual([[context, keyValue]])
})
