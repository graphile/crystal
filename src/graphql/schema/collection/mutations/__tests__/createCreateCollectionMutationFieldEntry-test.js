jest.mock('../../../getGqlType')
jest.mock('../../../createMutationGqlField')
jest.mock('../../getCollectionGqlType')
jest.mock('../../../transformGqlInputValue')

import getGqlType from '../../../getGqlType'
import transformGqlInputValue from '../../../transformGqlInputValue'
import createMutationGqlField from '../../../createMutationGqlField'
import getCollectionGqlType from '../../getCollectionGqlType'
import createCreateCollectionMutationFieldEntry from '../createCreateCollectionMutationFieldEntry'

createMutationGqlField.mockImplementation((buildToken, config) => Object.assign(config, { buildToken }))

beforeEach(() => {
  getGqlType.mockClear()
  transformGqlInputValue.mockClear()
  createMutationGqlField.mockClear()
  getCollectionGqlType.mockClear()
})

test('will return undefined if create is not defined', () => {
  expect(createCreateCollectionMutationFieldEntry({}, {})).toBe(undefined)
})

test('will create a field entry with the correct name', () => {
  const buildToken = Symbol('buildToken')
  const type = { name: 'person', getFields: () => ({}) }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[0]).toBe('createPerson')
  expect(fieldEntry[1].buildToken).toBe(buildToken)
  expect(fieldEntry[1].name).toBe('create_person')
})

test('will create a field entry with the correct input fields', () => {
  const gqlType = Symbol('gqlType')
  getGqlType.mockReturnValueOnce(gqlType)
  const buildToken = Symbol('buildToken')
  const type = { name: 'person', getFields: () => ({}) }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].inputFields).toEqual([['person', { type: gqlType, description: 'The `` to be created by this mutation.' }]])
  expect(getGqlType.mock.calls).toEqual([[buildToken, type, true]])
})

test('will create a field entry with output fields and no paginator', () => {
  const gqlCollectionType = Symbol('gqlCollectionType')
  getCollectionGqlType.mockReturnValueOnce(gqlCollectionType)
  const value = Symbol('value')
  const buildToken = Symbol('buildToken')
  const type = { name: 'person', getFields: () => ({}) }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].outputFields[0][0]).toBe('person')
  expect(fieldEntry[1].outputFields[0][1].type).toBe(gqlCollectionType)
  expect(fieldEntry[1].outputFields[0][1].resolve(value)).toBe(value)
  expect(fieldEntry[1].outputFields[1]).toBeFalsy()
  expect(getCollectionGqlType.mock.calls).toEqual([[buildToken, collection]])
})

const dateTest = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/

test('will not create with timestamps if timestamps not in buildToken', () => {
  const expectedResult = new Map()
  const type = { name: 'person', getFields: () => ({}) }
  const value = Symbol('value')
  const buildToken = {
    options: {
      timestamps: {
        created: 'fieldA',
        modified: 'fieldB',
      },
    },
  }
  const collection = { name: 'people', type, create: (ctx, output) => output }
  getCollectionGqlType.mockReturnValue(type)
  transformGqlInputValue.mockReturnValue(expectedResult)

  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  const [ fieldName, fieldSchema ] = fieldEntry

  const result = fieldSchema.execute({}, {})
  expect(result).toBe(expectedResult)
  expect(result.get('fieldA')).toBe(undefined)
  expect(result.get('fieldB')).toBe(undefined)
})

test('will create with timestamps if timestamps are given in buildToken', () => {
  const expectedResult = new Map()
  const type = { name: 'person', getFields: () => ({
    fieldA: { type: 'string' },
    fieldB: { type: 'string' },
  }) }
  const value = Symbol('value')
  const buildToken = { options: {
    timestamps: {
      created: 'fieldA',
      modified: 'fieldB',
    },
  } }
  const collection = { name: 'people', type, create: (ctx, output) => output }
  getCollectionGqlType.mockReturnValue(type)
  transformGqlInputValue.mockReturnValue(expectedResult)

  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  const [ fieldName, fieldSchema ] = fieldEntry

  const result = fieldSchema.execute({}, {})
  expect(result).toBe(expectedResult)
  expect(result.get('fieldA')).toMatch(dateTest)
  expect(result.get('fieldB')).toMatch(dateTest)
})
