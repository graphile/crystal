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
import transformPGValueIntoValue, { $$transformPGValueIntoValue } from '../transformPGValueIntoValue'

test('will call $$transformPGValueIntoValue if the type has the property', () => {
  const type = { [$$transformPGValueIntoValue]: jest.fn(x => x) }
  const value = Symbol()
  expect(transformPGValueIntoValue(type, value)).toBe(value)
  expect(type[$$transformPGValueIntoValue].mock.calls).toEqual([[value]])
})

test('will return the value for boolean, integer, float, and string types', () => {
  expect(transformPGValueIntoValue(booleanType, true)).toEqual(true)
  expect(transformPGValueIntoValue(integerType, 2)).toEqual(2)
  expect(transformPGValueIntoValue(floatType, 2.5)).toEqual(2.5)
  expect(transformPGValueIntoValue(stringType, 'abc')).toEqual('abc')
})

test('will return the value for enums', () => {
  expect(transformPGValueIntoValue(new EnumType({ name: 'foo', variants: ['a', 'b', 'c'] }), 'b')).toEqual('b')
})

test('will eagerly return null for NullableType, otherwise calling on the non-null type', () => {
  const type = new NullableType({ [$$transformPGValueIntoValue]: jest.fn(x => x) })
  const value = Symbol()
  expect(transformPGValueIntoValue(type, null)).toEqual(null)
  expect(transformPGValueIntoValue(type, value)).toBe(value)
  expect(type.nonNullType[$$transformPGValueIntoValue].mock.calls).toEqual([[value]])
})

test('will recursively call for every item with ListType', () => {
  const type = new ListType({ [$$transformPGValueIntoValue]: jest.fn(x => x) })
  const value = [Symbol(), Symbol(), Symbol()]
  expect(transformPGValueIntoValue(type, [])).toEqual([])
  expect(transformPGValueIntoValue(type, value)).toEqual(value)
  expect(type.itemType[$$transformPGValueIntoValue].mock.calls).toEqual([[value[0]], [value[1]], [value[2]]])
})

test('will convert ObjectType into a map and recursively call transformPGValueIntoValue', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
    ])
  })
  expect(transformPGValueIntoValue(type, { a: 1, b: 2, c: 3 })).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]))
  expect(type.fields.get('a').type[$$transformPGValueIntoValue].mock.calls).toEqual([[1]])
  expect(type.fields.get('b').type[$$transformPGValueIntoValue].mock.calls).toEqual([[2]])
  expect(type.fields.get('c').type[$$transformPGValueIntoValue].mock.calls).toEqual([[3]])
})

test('will throw an error with type ObjectType and value null', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
    ])
  })
  expect(() => transformPGValueIntoValue(type, null)).toThrow('Postgres value of object type may not be nullish.')
})

test('will throw an error with type ObjectType and a value that is not an object', () => {
  const type = new ObjectType({
    name: 'foo',
    fields: new Map([
      ['a', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
      ['b', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
      ['c', { type: { [$$transformPGValueIntoValue]: jest.fn(x => x) } }],
    ])
  })
  expect(() => transformPGValueIntoValue(type, 5)).toThrow('Postgres value of object type must be an object, not \'number\'.')
})

test('will throw an error when the type is not recognized', () => {
  expect(() => transformPGValueIntoValue({}, 2)).toThrow('Type \'[object Object]\' is not a valid type for converting Postgres values into interface values.')
})

test('will run the transform on an alias base type', () => {
  const type = new AliasType({
    name: 'foo',
    baseType: { [$$transformPGValueIntoValue]: jest.fn(x => x) },
  })
  const value = Symbol('value')
  expect(transformPGValueIntoValue(type, value)).toBe(value)
  expect(type.baseType[$$transformPGValueIntoValue].mock.calls).toEqual([[value]])
})
