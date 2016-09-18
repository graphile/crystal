import ObjectType from '../ObjectType'
import BasicObjectType from '../BasicObjectType'

const mockField = (name, isTypeOf) => ({
  getName: () => name,
  getType: () => ({ isTypeOf }),
})

test('is instanceof ObjectType', () => {
  expect(new BasicObjectType() instanceof ObjectType).toBe(true)
})

test('createFromFieldValues will build an object from field entries', () => {
  const objectType = new BasicObjectType()
  expect(objectType.createFromFieldValues(new Map([['a', 1], ['b', 2], ['c', 3]]))).toEqual({ a: 1, b: 2, c: 3 })
  expect(objectType.createFromFieldValues(new Map([['a', 1], ['a', 2]]))).toEqual({ a: 2 })
})

test('createFromFieldValues will fail if an isTypeOf is false', () => {
  const fieldA = mockField('a', value => value === 1)
  const fieldB = mockField('b', value => value === 2)
  const objectType = new BasicObjectType()
  expect(objectType.createFromFieldValues(new Map([['a', 1], ['b', 1]]))).toEqual({ a: 1, b: 1 })
  objectType.addField(fieldA).addField(fieldB)
  expect(() => objectType.createFromFieldValues(new Map([['a', 1], ['b', 1]]))).toThrow()
  expect(objectType.createFromFieldValues(new Map([['a', 1], ['b', 2]]))).toEqual({ a: 1, b: 2 })
})

test('getFields will get fields added by addField', () => {
  const objectType = new BasicObjectType()
  const fields = [
    mockField('a'),
    mockField('b'),
    mockField('c'),
  ]
  expect(objectType.getFields()).toEqual([])
  objectType.addField(fields[0]).addField(fields[1])
  expect(objectType.getFields()).toEqual([fields[0], fields[1]])
  objectType.addField(fields[2])
  expect(objectType.getFields()).toEqual(fields)
})

test('addField will not add two fields of the same name', () => {
  const objectType = new BasicObjectType()
  objectType.addField(mockField('a'))
  expect(() => objectType.addField(mockField('a'))).toThrow()
  objectType.addField(mockField('b'))
  expect(() => objectType.addField(mockField('c')).addField(mockField('c'))).toThrow()
})
