import {
  booleanType,
  integerType,
  floatType,
  stringType,
  EnumType,
  NullableType,
  ListType,
  ObjectType,
  AliasType,
} from '../../../interface'
import transformPGValue, { $$transformPGValue } from '../transformPGValue'

test('will call $$transformPGValue if the type has the property', () => {
  const type = { [$$transformPGValue]: jest.fn(x => x) }
  const value = Symbol()
  expect(transformPGValue(type, value)).toBe(value)
  expect(type[$$transformPGValue].mock.calls).toEqual([[value]])
})

test('will return the value for boolean, integer, float, and string types', () => {
  expect(transformPGValue(booleanType, true)).toEqual(true)
  expect(transformPGValue(integerType, 2)).toEqual(2)
  expect(transformPGValue(floatType, 2.5)).toEqual(2.5)
  expect(transformPGValue(stringType, 'abc')).toEqual('abc')
})

test('will return the value for enums', () => {
  expect(transformPGValue(new EnumType({ name: 'foo', variants: ['a', 'b', 'c'] }), 'b')).toEqual('b')
})

test('will eagerly return null for NullableType, otherwise calling on the non-null type', () => {
  const type = new NullableType({ [$$transformPGValue]: jest.fn(x => x) })
  const value = Symbol()
  expect(transformPGValue(type, null)).toEqual(null)
  expect(transformPGValue(type, value)).toBe(value)
  expect(type.nonNullType[$$transformPGValue].mock.calls).toEqual([[value]])
})

test('will recursively call for every item with ListType', () => {
  const type = new ListType({ [$$transformPGValue]: jest.fn(x => x) })
  const value = [Symbol(), Symbol(), Symbol()]
  expect(transformPGValue(type, [])).toEqual([])
  expect(transformPGValue(type, value)).toEqual(value)
  expect(type.itemType[$$transformPGValue].mock.calls).toEqual([[value[0]], [value[1]], [value[2]]])
})

test('will convert ObjectType into a map and recursively call transformPGValue', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
    ])
  })
  expect(transformPGValue(type, { a: 1, b: 2, c: 3 })).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]))
  expect(type.fields.get('a').type[$$transformPGValue].mock.calls).toEqual([[1]])
  expect(type.fields.get('b').type[$$transformPGValue].mock.calls).toEqual([[2]])
  expect(type.fields.get('c').type[$$transformPGValue].mock.calls).toEqual([[3]])
})

test('will throw an error with type ObjectType and value null', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
    ])
  })
  expect(() => transformPGValue(type, null)).toThrow('Postgres value of object type may not be nullish.')
})

test('will throw an error with type ObjectType and a value that is not an object', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPGValue]: jest.fn(x => x) } }],
    ])
  })
  expect(() => transformPGValue(type, 5)).toThrow('Postgres value of object type must be an object, not \'number\'.')
})

test('will throw an error when the type is not recognized', () => {
  expect(() => transformPGValue({}, 2)).toThrow('Type \'[object Object]\' is not a valid type for converting Postgres values into interface values.')
})

test('will run the transform on an alias base type', () => {
  const type = new AliasType({
    name: 'foo',
    baseType: { [$$transformPGValue]: jest.fn(x => x) },
  })
  const value = Symbol('value')
  expect(transformPGValue(type, value)).toBe(value)
  expect(type.baseType[$$transformPGValue].mock.calls).toEqual([[value]])
})
