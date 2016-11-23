import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  Kind,
} from 'graphql'

import {
  NullableType,
  ListType,
  AliasType,
  EnumType,
  booleanType,
  integerType,
  floatType,
  stringType,
  ObjectType,
} from '../../../interface'

import { $$gqlInputObjectTypeValueKeyName } from '../transformGqlInputValue'
import getGqlType, { _getJsonGqlType } from '../getGqlType'

const mockBuildToken = ({
  _typeOverrides = new Map(),
} = {}) => ({
  inventory: {
    getCollections: () => [],
  },
  _typeOverrides,
})

const mockEnumType = () =>
  new EnumType({ name: 'enoom', variants: ['a', 'b', 'c'] })

const mockObjectType = () =>
  new ObjectType({
    name: 'yo',
    description: 'yoyoyo',
    fields: new Map([
      ['a', { type: booleanType, description: 'aaaa!' }],
      ['b', { type: new NullableType(booleanType) }],
    ]),
  })

test('will return the exact same thing for types that are both inputs and outputs', () => {
  const buildToken = mockBuildToken()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getGqlType(buildToken, enumType, false)).toBe(getGqlType(buildToken, enumType, true))
  expect(getGqlType(buildToken, objectType, false)).not.toBe(getGqlType(buildToken, objectType, true))
})

test('is memoized', () => {
  const buildToken1 = mockBuildToken()
  const buildToken2 = mockBuildToken()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getGqlType(buildToken1, enumType, false)).toBe(getGqlType(buildToken1, enumType, false))
  expect(getGqlType(buildToken1, enumType, true)).toBe(getGqlType(buildToken1, enumType, true))
  expect(getGqlType(buildToken1, objectType, false)).toBe(getGqlType(buildToken1, objectType, false))
  expect(getGqlType(buildToken1, objectType, true)).toBe(getGqlType(buildToken1, objectType, true))
  expect(getGqlType(buildToken2, enumType, false)).toBe(getGqlType(buildToken2, enumType, false))
  expect(getGqlType(buildToken2, enumType, true)).toBe(getGqlType(buildToken2, enumType, true))
  expect(getGqlType(buildToken2, objectType, false)).toBe(getGqlType(buildToken2, objectType, false))
  expect(getGqlType(buildToken2, objectType, true)).toBe(getGqlType(buildToken2, objectType, true))
  expect(getGqlType(buildToken1, enumType, false)).not.toBe(getGqlType(buildToken2, enumType, false))
  expect(getGqlType(buildToken1, enumType, true)).not.toBe(getGqlType(buildToken2, enumType, true))
  expect(getGqlType(buildToken1, objectType, false)).not.toBe(getGqlType(buildToken2, objectType, false))
  expect(getGqlType(buildToken1, objectType, true)).not.toBe(getGqlType(buildToken2, objectType, true))
})

test('will invert nullable types', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getGqlType(buildToken, booleanType, false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getGqlType(buildToken, new NullableType(booleanType), false)
  expect(gqlType2).toBe(GraphQLBoolean)
})

test('will remove many nullable wrappers', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGqlType(buildToken, new NullableType(new NullableType(new NullableType(booleanType))), false)
  expect(gqlType).toBe(GraphQLBoolean)
})

test('will clone base types for aliases', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getGqlType(buildToken, new AliasType({ name: 'yo', baseType: booleanType }), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(Object.getPrototypeOf(gqlType1.ofType)).toBe(GraphQLBoolean)
  expect(gqlType1.ofType.name).toBe('Yo')
  const gqlType2 = getGqlType(buildToken, new AliasType({ name: 'yo', baseType: new NullableType(booleanType) }), false)
  expect(Object.getPrototypeOf(gqlType2)).toBe(GraphQLBoolean)
  expect(gqlType2.name).toBe('Yo')
  const gqlType3 = getGqlType(buildToken, new NullableType(new AliasType({ name: 'yo', baseType: booleanType })), false)
  expect(Object.getPrototypeOf(gqlType3)).toBe(GraphQLBoolean)
  expect(gqlType3.name).toBe('Yo')
})

test('will create lists correctly', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getGqlType(buildToken, new ListType(booleanType), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType instanceof GraphQLList).toBe(true)
  expect(gqlType1.ofType.ofType instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType.ofType.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getGqlType(buildToken, new NullableType(new ListType(new NullableType(booleanType))), false)
  expect(gqlType2 instanceof GraphQLList).toBe(true)
  expect(gqlType2.ofType).toBe(GraphQLBoolean)
})

test('will correctly create enums', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGqlType(buildToken, new NullableType(mockEnumType()), false)
  expect(gqlType instanceof GraphQLEnumType).toBe(true)
  expect(gqlType.name).toBe('Enoom')
  expect(gqlType.getValues().map(({ name }) => name)).toEqual(['A', 'B', 'C'])
})

test('will correctly return primitive types', () => {
  const buildToken = mockBuildToken()
  expect(getGqlType(buildToken, new NullableType(booleanType), false)).toBe(GraphQLBoolean)
  expect(getGqlType(buildToken, new NullableType(integerType), false)).toBe(GraphQLInt)
  expect(getGqlType(buildToken, new NullableType(floatType), false)).toBe(GraphQLFloat)
  expect(getGqlType(buildToken, new NullableType(stringType), false)).toBe(GraphQLString)
})

test('will correctly make an object output type', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGqlType(buildToken, new NullableType(mockObjectType()), false)
  expect(gqlType instanceof GraphQLObjectType).toBe(true)
  expect(gqlType.name).toBe('Yo')
  expect(gqlType.description).toBe('yoyoyo')
  expect(gqlType.getFields().a.name).toBe('a')
  expect(gqlType.getFields().a.description).toBe('aaaa!')
  expect(gqlType.getFields().a.type instanceof GraphQLNonNull).toBe(true)
  expect(gqlType.getFields().a.type.ofType).toBe(GraphQLBoolean)
  expect(gqlType.getFields().b.name).toBe('b')
  expect(gqlType.getFields().b.description).toBe(undefined)
  expect(gqlType.getFields().b.type).toBe(GraphQLBoolean)
})

test('will correctly make an input object type', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGqlType(buildToken, new NullableType(mockObjectType()), true)
  expect(gqlType instanceof GraphQLInputObjectType).toBe(true)
  expect(gqlType.name).toBe('YoInput')
  expect(gqlType.description).toBe('yoyoyo')
  expect(gqlType.getFields().a.name).toBe('a')
  expect(gqlType.getFields().a.description).toBe('aaaa!')
  expect(gqlType.getFields().a.type instanceof GraphQLNonNull).toBe(true)
  expect(gqlType.getFields().a.type.ofType).toBe(GraphQLBoolean)
  expect(gqlType.getFields().a[$$gqlInputObjectTypeValueKeyName]).toBe('a')
  expect(gqlType.getFields().b.name).toBe('b')
  expect(gqlType.getFields().b.description).toBe(undefined)
  expect(gqlType.getFields().b.type).toBe(GraphQLBoolean)
  expect(gqlType.getFields().b[$$gqlInputObjectTypeValueKeyName]).toBe('b')
})

test('will use type overrides', () => {
  const a = Symbol('a')
  const b = Symbol('b')
  const c = Symbol('c')
  const d = Symbol('d')
  const buildToken = mockBuildToken({
    _typeOverrides: new Map([
      [stringType, { input: a, output: b }],
      [booleanType, { input: c }],
      [integerType, { output: d }],
    ]),
  })
  expect(getGqlType(buildToken, stringType, true)).toEqual(a)
  expect(getGqlType(buildToken, stringType, false)).toEqual(b)
  expect(getGqlType(buildToken, booleanType, true)).toEqual(c)
  expect(getGqlType(buildToken, booleanType, false)).toEqual(new GraphQLNonNull(GraphQLBoolean))
  expect(getGqlType(buildToken, integerType, true)).toEqual(new GraphQLNonNull(GraphQLInt))
  expect(getGqlType(buildToken, integerType, false)).toEqual(d)
  expect(getGqlType(buildToken, floatType, true)).toEqual(new GraphQLNonNull(GraphQLFloat))
  expect(getGqlType(buildToken, floatType, false)).toEqual(new GraphQLNonNull(GraphQLFloat))
})

test('_getJsonGqlType will create a boring JSON type with no dynamic input', () => {
  const jsonGqlType = _getJsonGqlType({ options: { dynamicJson: false } })
  expect(jsonGqlType.serialize('{"a":1,"b":2,"c":3}')).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGqlType.parseValue('{"a":1,"b":2,"c":3}')).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGqlType.parseLiteral({ kind: Kind.STRING, value: '{"a":1,"b":2,"c":3}' })).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGqlType.parseLiteral({ kind: Kind.BOOLEAN, value: true })).toEqual(null)
  expect(jsonGqlType.parseLiteral({ kind: Kind.INT, value: 20 })).toEqual(null)
  expect(jsonGqlType.parseLiteral({ kind: Kind.FLOAT, value: 3.1415 })).toEqual(null)
  expect(jsonGqlType.parseLiteral({ kind: Kind.OBJECT, fields: [{ name: { value: 'a' }, value: { kind: Kind.INT, value: 1 } }, { name: { value: 'b' }, value: { kind: Kind.INT, value: 2 } }] })).toEqual(null)
  expect(jsonGqlType.parseLiteral({ kind: Kind.LIST, values: [{ kind: Kind.INT, value: 1 }, { kind: Kind.INT, value: 2 }, { kind: Kind.INT, value: 3 }] })).toEqual(null)
})

test('_getJsonGqlType will create a dynamic JSON type', () => {
  const jsonGqlType = _getJsonGqlType({ options: { dynamicJson: true } })
  expect(jsonGqlType.serialize('{"a":1,"b":2,"c":3}')).toEqual({ a: 1, b: 2, c: 3 })
  expect(jsonGqlType.parseValue({ a: 1, b: 2, c: 3 })).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGqlType.parseLiteral({ kind: Kind.STRING, value: 'hello, world!' })).toEqual('"hello, world!"')
  expect(jsonGqlType.parseLiteral({ kind: Kind.BOOLEAN, value: true })).toEqual('true')
  expect(jsonGqlType.parseLiteral({ kind: Kind.INT, value: 20 })).toEqual('20')
  expect(jsonGqlType.parseLiteral({ kind: Kind.FLOAT, value: 3.1415 })).toEqual('3.1415')
  expect(jsonGqlType.parseLiteral({ kind: Kind.OBJECT, fields: [{ name: { value: 'a' }, value: { kind: Kind.INT, value: 1 } }, { name: { value: 'b' }, value: { kind: Kind.INT, value: 2 } }] })).toEqual('{"a":1,"b":2}')
  expect(jsonGqlType.parseLiteral({ kind: Kind.LIST, values: [{ kind: Kind.INT, value: 1 }, { kind: Kind.INT, value: 2 }, { kind: Kind.INT, value: 3 }] })).toEqual('[1,2,3]')
})
