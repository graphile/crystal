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
import transformPgValueIntoValue, { $$transformPgValueIntoValue } from '../transformPgValueIntoValue'

test('will call $$transformPgValueIntoValue if the type has the property', () => {
  const type = { [$$transformPgValueIntoValue]: jest.fn(x => x) }
  const value = Symbol()
  expect(transformPgValueIntoValue(type, value)).toBe(value)
  expect(type[$$transformPgValueIntoValue].mock.calls).toEqual([[value]])
})

test('will return the value for boolean, integer, float, and string types', () => {
  expect(transformPgValueIntoValue(booleanType, true)).toEqual(true)
  expect(transformPgValueIntoValue(integerType, 2)).toEqual(2)
  expect(transformPgValueIntoValue(floatType, 2.5)).toEqual(2.5)
  expect(transformPgValueIntoValue(stringType, 'abc')).toEqual('abc')
})

test('will return the value for enums', () => {
  expect(transformPgValueIntoValue(new EnumType({ name: 'foo', variants: ['a', 'b', 'c'] }), 'b')).toEqual('b')
})

test('will eagerly return null for NullableType, otherwise calling on the non-null type', () => {
  const type = new NullableType({ [$$transformPgValueIntoValue]: jest.fn(x => x) })
  const value = Symbol()
  expect(transformPgValueIntoValue(type, null)).toEqual(null)
  expect(transformPgValueIntoValue(type, value)).toBe(value)
  expect(type.nonNullType[$$transformPgValueIntoValue].mock.calls).toEqual([[value]])
})

test('will recursively call for every item with ListType', () => {
  const type = new ListType({ [$$transformPgValueIntoValue]: jest.fn(x => x) })
  const value = [Symbol(), Symbol(), Symbol()]
  expect(transformPgValueIntoValue(type, [])).toEqual([])
  expect(transformPgValueIntoValue(type, value)).toEqual(value)
  expect(type.itemType[$$transformPgValueIntoValue].mock.calls).toEqual([[value[0]], [value[1]], [value[2]]])
})

test('will convert ObjectType into a map and recursively call transformPgValueIntoValue', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
    ])
  })
  expect(transformPgValueIntoValue(type, { a: 1, b: 2, c: 3 })).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]))
  expect(type.fields.get('a').type[$$transformPgValueIntoValue].mock.calls).toEqual([[1]])
  expect(type.fields.get('b').type[$$transformPgValueIntoValue].mock.calls).toEqual([[2]])
  expect(type.fields.get('c').type[$$transformPgValueIntoValue].mock.calls).toEqual([[3]])
})

test('will throw an error with type ObjectType and value null', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
    ])
  })
  expect(() => transformPgValueIntoValue(type, null)).toThrow('Postgres value of object type may not be nullish.')
})

test('will throw an error with type ObjectType and a value that is not an object', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPgValueIntoValue]: jest.fn(x => x) } }],
    ])
  })
  expect(() => transformPgValueIntoValue(type, 5)).toThrow('Postgres value of object type must be an object, not \'number\'.')
})

test('will throw an error when the type is not recognized', () => {
  expect(() => transformPgValueIntoValue({}, 2)).toThrow('Type \'[object Object]\' is not a valid type for converting Postgres values into interface values.')
})

test('will run the transform on an alias base type', () => {
  const type = new AliasType({
    name: 'foo',
    baseType: { [$$transformPgValueIntoValue]: jest.fn(x => x) },
  })
  const value = Symbol('value')
  expect(transformPgValueIntoValue(type, value)).toBe(value)
  expect(type.baseType[$$transformPgValueIntoValue].mock.calls).toEqual([[value]])
})
