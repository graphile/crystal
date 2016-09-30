jest.mock('../../../getType')
jest.mock('../../getCollectionType')
jest.mock('../createMutationField')

import getType from '../../../getType'
import getCollectionType from '../../getCollectionType'
import createMutationField from '../createMutationField'
import createCollectionCreateMutationFieldEntry from '../createCollectionCreateMutationFieldEntry'

createMutationField.mockImplementation((buildToken, config) => Object.assign(config, { buildToken }))

test('will return undefined if create is not defined', () => {
  expect(createCollectionCreateMutationFieldEntry({}, {})).toBe(undefined)
})

test('will create a field entry with the correct name', () => {
  const buildToken = Symbol('buildToken')
  const type = { name: 'person' }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCollectionCreateMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[0]).toBe('createPerson')
  expect(fieldEntry[1].buildToken).toBe(buildToken)
  expect(fieldEntry[1].name).toBe('create-person')
})

test('will create a field entry with the correct input fields', () => {
  getType.mockClear()
  const gqlType = Symbol('gqlType')
  getType.mockReturnValueOnce(gqlType)
  const buildToken = Symbol('buildToken')
  const type = { name: 'person' }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCollectionCreateMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].inputFields).toEqual([['person', { type: gqlType }]])
  expect(getType.mock.calls).toEqual([[buildToken, type, true]])
})

test('will create a field entry with output fields and no paginator', () => {
  const gqlCollectionType = Symbol('gqlCollectionType')
  getCollectionType.mockClear()
  getCollectionType.mockReturnValueOnce(gqlCollectionType)
  const value = Symbol('value')
  const buildToken = Symbol('buildToken')
  const type = { name: 'person' }
  const collection = { name: 'people', type, create: true }
  const fieldEntry = createCollectionCreateMutationFieldEntry(buildToken, collection)
  expect(fieldEntry[1].outputFields[0][0]).toBe('person')
  expect(fieldEntry[1].outputFields[0][1].type).toBe(gqlCollectionType)
  expect(fieldEntry[1].outputFields[0][1].resolve(value)).toBe(value)
  expect(fieldEntry[1].outputFields[1]).toBeFalsy()
  expect(getCollectionType.mock.calls).toEqual([[buildToken, collection]])
})
