jest.mock('../../../createMutationGqlField')
jest.mock('../../../type/getGqlInputType')
jest.mock('../../../type/getGqlOutputType')

import getGqlInputType from '../../../type/getGqlInputType'
import getGqlOutputType from '../../../type/getGqlOutputType'
import createMutationGqlField from '../../../createMutationGqlField'

import createCreateCollectionMutationFieldEntry from '../createCreateCollectionMutationFieldEntry'

createMutationGqlField.mockImplementation((buildToken, config) => Object.assign(config, { buildToken }))

beforeEach(() => {
  createMutationGqlField.mockClear()
  getGqlOutputType.mockClear()
  getGqlInputType.mockClear()
})

test('will return undefined if create is not defined', () => {
  expect(createCreateCollectionMutationFieldEntry({}, {})).toBe(undefined)
})

test('will create a field entry with the correct name', () => {
  const gqlType = Symbol('gqlType')
  const buildToken = Symbol('buildToken')
  const type = { name: 'person', fields: {} }
  getGqlInputType.mockReturnValueOnce({ gqlType })
  getGqlOutputType.mockReturnValueOnce({ gqlType })
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[0]).toBe('createPerson')
  expect(fieldEntry[1].buildToken).toBe(buildToken)
  expect(fieldEntry[1].name).toBe('create-person')
})

test('will create a field entry with the correct input fields', () => {
  const gqlType = Symbol('gqlType')
  const buildToken = Symbol('buildToken')
  const type = { name: 'person', fields: {} }
  getGqlInputType.mockReturnValueOnce({
    gqlType: type,
  })
  getGqlOutputType.mockReturnValueOnce({
    gqlType: type,
  })
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].inputFields).toEqual([['person', {
    type,
    description: 'The `person` to be created by this mutation.',
  }]])
  expect(getGqlInputType.mock.calls).toEqual([[buildToken, type]])
})

test('will create a field entry with output fields and no paginator', () => {
  const gqlCollectionType = Symbol('gqlCollectionType')
  const value = Symbol('value')
  const buildToken = Symbol('buildToken')
  const type = { name: 'person', fields: {} }
  const collection = { name: 'people', type, create: true }
  getGqlInputType.mockReturnValueOnce({
    gqlType: type,
  })
  getGqlOutputType.mockReturnValueOnce({
    gqlType: type,
  })
  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].outputFields[0][0]).toBe('person')
  expect(fieldEntry[1].outputFields[0][1].type).toBe(type)
  expect(fieldEntry[1].outputFields[0][1].resolve(value)).toBe(value)
  expect(fieldEntry[1].outputFields[1]).toBeFalsy()
})

const dateTest = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/

test('will not create with timestamps if timestamps not in buildToken', () => {
  const expectedResult = new Map()
  const type = { name: 'person', fields: {} }
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
  getGqlInputType.mockReturnValueOnce({
    gqlType: type,
    fromGqlInput: (x) => expectedResult,
  })
  getGqlOutputType.mockReturnValueOnce({
    gqlType: type,
  })

  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  const [ fieldName, fieldSchema ] = fieldEntry

  const result = fieldSchema.execute({}, {})
  expect(result).toBe(expectedResult)
  expect(result.get('fieldA')).toBe(undefined)
  expect(result.get('fieldB')).toBe(undefined)
})

test('will create with timestamps if timestamps are given in buildToken', () => {
  const expectedResult = new Map()
  const type = { name: 'person', fields: {
    fieldA: { type: 'string' },
    fieldB: { type: 'string' },
  } }
  const value = Symbol('value')
  const buildToken = { options: {
    timestamps: {
      created: 'fieldA',
      modified: 'fieldB',
    },
  } }
  const collection = { name: 'people', type, create: (ctx, output) => output }
  getGqlInputType.mockReturnValueOnce({
    gqlType: type,
    fromGqlInput: () => expectedResult,
  })
  getGqlOutputType.mockReturnValueOnce({
    gqlType: type,
  })

  const fieldEntry = createCreateCollectionMutationFieldEntry(buildToken, collection)
  const [ fieldName, fieldSchema ] = fieldEntry

  const result = fieldSchema.execute({}, {})
  expect(result).toBe(expectedResult)
  expect(result.get('fieldA')).toMatch(dateTest)
  expect(result.get('fieldB')).toMatch(dateTest)
})
