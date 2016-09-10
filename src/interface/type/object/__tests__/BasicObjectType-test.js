import ObjectType from '../ObjectType'
import BasicObjectType from '../BasicObjectType'

const mockField = (name, isTypeOf) => ({
  getName: () => name,
  getType: () => ({ isTypeOf }),
})

test('is instanceof ObjectType', () => {
  expect(new BasicObjectType() instanceof ObjectType).toBe(true)
})

test('isTypeOf will be false for non-objects', () => {
  const objectType = new BasicObjectType()
  expect(objectType.isTypeOf(undefined)).toBe(false)
  expect(objectType.isTypeOf(null)).toBe(false)
  expect(objectType.isTypeOf(true)).toBe(false)
  expect(objectType.isTypeOf(false)).toBe(false)
  expect(objectType.isTypeOf(42)).toBe(false)
  expect(objectType.isTypeOf(3.14)).toBe(false)
  expect(objectType.isTypeOf('hello')).toBe(false)
  expect(objectType.isTypeOf(() => {})).toBe(false)
})

test('isTypeOf will return true for objects when there are no fields defined', () => {
  const objectType = new BasicObjectType()
  expect(objectType.isTypeOf({})).toBe(true)
  expect(objectType.isTypeOf({ a: 1, b: 2 })).toBe(true)
})

test('isTypeOf will check isTypeOf for all fields', () => {
  const fieldA = mockField('a', value => value === 1)
  const fieldB = mockField('b', value => value === 2)
  const fieldC = mockField('c', value => value === 3)
  const objectType = new BasicObjectType()
  objectType.addField(fieldA).addField(fieldB)
  expect(objectType.isTypeOf({ a: 1, b: 2 })).toBe(true)
  expect(objectType.isTypeOf({ a: 2, b: 2 })).toBe(false)
  expect(objectType.isTypeOf({ a: 1, b: 1 })).toBe(false)
  expect(objectType.isTypeOf({ a: 3, b: 3 })).toBe(false)
  objectType.addField(fieldC)
  expect(objectType.isTypeOf({ a: 1, b: 2 })).toBe(false)
  expect(objectType.isTypeOf({ a: 1, b: 2, c: 3 })).toBe(true)
  expect(objectType.isTypeOf({ a: 3, b: 1, c: 2 })).toBe(false)
})

test('isTypeOf will ignore extraneous fields on the value', () => {
  const fieldA = mockField('a', value => value === 1)
  const fieldB = mockField('b', value => value === 2)
  const objectType = new BasicObjectType()
  objectType.addField(fieldA).addField(fieldB)
  expect(objectType.isTypeOf({ a: 1, b: 2 })).toBe(true)
  expect(objectType.isTypeOf({ a: 1, b: 2, c: 3, d: 4 })).toBe(true)
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
