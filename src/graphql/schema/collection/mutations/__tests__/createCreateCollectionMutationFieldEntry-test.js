jest.mock('../../../getGqlType')
jest.mock('../../../createMutationGqlField')
jest.mock('../../getCollectionGqlType')

import getGqlType from '../../../getGqlType'
import createMutationGqlField from '../../../createMutationGqlField'
import getCollectionGqlType from '../../getCollectionGqlType'
import createCreateCollectionMutationFieldEntry from '../createCreateCollectionMutationFieldEntry'

createMutationGqlField.mockImplementation((buildToken, config) => Object.assign(config, { buildToken }))

test('will return undefined if create is not defined', () => {
  expect(createCreateCollectionMutationFieldEntry({}, {})).toBe(undefined)
})

test('will create a field entry with the correct name', () => {
  const buildToken = Symbol('buildToken')
  const type = { name: 'person' }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[0]).toBe('createPerson')
  expect(fieldEntry[1].buildToken).toBe(buildToken)
  expect(fieldEntry[1].name).toBe('create-person')
})

test('will create a field entry with the correct input fields', () => {
  getGqlType.mockClear()
  const gqlType = Symbol('gqlType')
  getGqlType.mockReturnValueOnce(gqlType)
  const buildToken = Symbol('buildToken')
  const type = { name: 'person' }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].inputFields).toEqual([['person', { type: gqlType, description: 'The `` to be created by this mutation.' }]])
  expect(getGqlType.mock.calls).toEqual([[buildToken, type, true]])
})

test('will create a field entry with output fields and no paginator', () => {
  const gqlCollectionType = Symbol('gqlCollectionType')
  getCollectionGqlType.mockClear()
  getCollectionGqlType.mockReturnValueOnce(gqlCollectionType)
  const value = Symbol('value')
  const buildToken = Symbol('buildToken')
  const type = { name: 'person' }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].outputFields[0][0]).toBe('person')
  expect(fieldEntry[1].outputFields[0][1].type).toBe(gqlCollectionType)
  expect(fieldEntry[1].outputFields[0][1].resolve(value)).toBe(value)
  expect(fieldEntry[1].outputFields[1]).toBeFalsy()
  expect(getCollectionGqlType.mock.calls).toEqual([[buildToken, collection]])
})
