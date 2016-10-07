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

import { $$gqlInputObjectTypeValueKeyName } from '../transformGQLInputValue'
import getGQLType, { _getJSONGQLType } from '../getGQLType'

const mockBuildToken = () => ({
  inventory: {
    getCollections: () => [],
  },
})

const mockEnumType = () =>
  new EnumType({ name: 'enoom', variants: ['a', 'b', 'c'] })

const mockObjectType = () =>
  new ObjectType({
    name: 'yo',
    description: 'yoyoyo',
    fields: new Map([
      ['a', { type: booleanType, description: 'aaaa!' }],
      ['b', { type: new NullableType(booleanType) }]
    ]),
  })

test('will return the exact same thing for types that are both inputs and outputs', () => {
  const buildToken = mockBuildToken()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getGQLType(buildToken, enumType, false)).toBe(getGQLType(buildToken, enumType, true))
  expect(getGQLType(buildToken, objectType, false)).not.toBe(getGQLType(buildToken, objectType, true))
})

test('is memoized', () => {
  const buildToken1 = mockBuildToken()
  const buildToken2 = mockBuildToken()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getGQLType(buildToken1, enumType, false)).toBe(getGQLType(buildToken1, enumType, false))
  expect(getGQLType(buildToken1, enumType, true)).toBe(getGQLType(buildToken1, enumType, true))
  expect(getGQLType(buildToken1, objectType, false)).toBe(getGQLType(buildToken1, objectType, false))
  expect(getGQLType(buildToken1, objectType, true)).toBe(getGQLType(buildToken1, objectType, true))
  expect(getGQLType(buildToken2, enumType, false)).toBe(getGQLType(buildToken2, enumType, false))
  expect(getGQLType(buildToken2, enumType, true)).toBe(getGQLType(buildToken2, enumType, true))
  expect(getGQLType(buildToken2, objectType, false)).toBe(getGQLType(buildToken2, objectType, false))
  expect(getGQLType(buildToken2, objectType, true)).toBe(getGQLType(buildToken2, objectType, true))
  expect(getGQLType(buildToken1, enumType, false)).not.toBe(getGQLType(buildToken2, enumType, false))
  expect(getGQLType(buildToken1, enumType, true)).not.toBe(getGQLType(buildToken2, enumType, true))
  expect(getGQLType(buildToken1, objectType, false)).not.toBe(getGQLType(buildToken2, objectType, false))
  expect(getGQLType(buildToken1, objectType, true)).not.toBe(getGQLType(buildToken2, objectType, true))
})

test('will invert nullable types', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getGQLType(buildToken, booleanType, false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getGQLType(buildToken, new NullableType(booleanType), false)
  expect(gqlType2).toBe(GraphQLBoolean)
})

test('will remove many nullable wrappers', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGQLType(buildToken, new NullableType(new NullableType(new NullableType(booleanType))), false)
  expect(gqlType).toBe(GraphQLBoolean)
})

test('will clone base types for aliases', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getGQLType(buildToken, new AliasType({ name: 'yo', baseType: booleanType }), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(Object.getPrototypeOf(gqlType1.ofType)).toBe(GraphQLBoolean)
  expect(gqlType1.ofType.name).toBe('Yo')
  const gqlType2 = getGQLType(buildToken, new AliasType({ name: 'yo', baseType: new NullableType(booleanType) }), false)
  expect(Object.getPrototypeOf(gqlType2)).toBe(GraphQLBoolean)
  expect(gqlType2.name).toBe('Yo')
  const gqlType3 = getGQLType(buildToken, new NullableType(new AliasType({ name: 'yo', baseType: booleanType })), false)
  expect(Object.getPrototypeOf(gqlType3)).toBe(GraphQLBoolean)
  expect(gqlType3.name).toBe('Yo')
})

test('will create lists correctly', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getGQLType(buildToken, new ListType(booleanType), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType instanceof GraphQLList).toBe(true)
  expect(gqlType1.ofType.ofType instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType.ofType.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getGQLType(buildToken, new NullableType(new ListType(new NullableType(booleanType))), false)
  expect(gqlType2 instanceof GraphQLList).toBe(true)
  expect(gqlType2.ofType).toBe(GraphQLBoolean)
})

test('will correctly create enums', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGQLType(buildToken, new NullableType(mockEnumType()), false)
  expect(gqlType instanceof GraphQLEnumType).toBe(true)
  expect(gqlType.name).toBe('Enoom')
  expect(gqlType.getValues().map(({ name }) => name)).toEqual(['A', 'B', 'C'])
})

test('will correctly return primitive types', () => {
  const buildToken = mockBuildToken()
  expect(getGQLType(buildToken, new NullableType(booleanType), false)).toBe(GraphQLBoolean)
  expect(getGQLType(buildToken, new NullableType(integerType), false)).toBe(GraphQLInt)
  expect(getGQLType(buildToken, new NullableType(floatType), false)).toBe(GraphQLFloat)
  expect(getGQLType(buildToken, new NullableType(stringType), false)).toBe(GraphQLString)
})

test('will correctly make an object output type', () => {
  const buildToken = mockBuildToken()
  const gqlType = getGQLType(buildToken, new NullableType(mockObjectType()), false)
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
  const gqlType = getGQLType(buildToken, new NullableType(mockObjectType()), true)
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

test('_getJSONGQLType will create a boring JSON type with no dynamic input', () => {
  const jsonGQLType = _getJSONGQLType({ options: { dynamicJson: false } })
  expect(jsonGQLType.name).toBe('JSON')
  expect(jsonGQLType.serialize('{"a":1,"b":2,"c":3}')).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGQLType.parseValue('{"a":1,"b":2,"c":3}')).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGQLType.parseLiteral({ kind: Kind.STRING, value: '{"a":1,"b":2,"c":3}' })).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGQLType.parseLiteral({ kind: Kind.BOOLEAN, value: true })).toEqual(null)
  expect(jsonGQLType.parseLiteral({ kind: Kind.INT, value: 20 })).toEqual(null)
  expect(jsonGQLType.parseLiteral({ kind: Kind.FLOAT, value: 3.1415 })).toEqual(null)
  expect(jsonGQLType.parseLiteral({ kind: Kind.OBJECT, fields: [{ name: { value: 'a' }, value: { kind: Kind.INT, value: 1 } }, { name: { value: 'b' }, value: { kind: Kind.INT, value: 2 } }] })).toEqual(null)
  expect(jsonGQLType.parseLiteral({ kind: Kind.LIST, values: [{ kind: Kind.INT, value: 1 }, { kind: Kind.INT, value: 2 }, { kind: Kind.INT, value: 3 }] })).toEqual(null)
})

test('_getJSONGQLType will create a dynamic JSON type', () => {
  const jsonGQLType = _getJSONGQLType({ options: { dynamicJson: true } })
  expect(jsonGQLType.name).toBe('JSON')
  expect(jsonGQLType.serialize('{"a":1,"b":2,"c":3}')).toEqual({ a: 1, b: 2, c: 3 })
  expect(jsonGQLType.parseValue({ a: 1, b: 2, c: 3 })).toEqual('{"a":1,"b":2,"c":3}')
  expect(jsonGQLType.parseLiteral({ kind: Kind.STRING, value: 'hello, world!' })).toEqual('"hello, world!"')
  expect(jsonGQLType.parseLiteral({ kind: Kind.BOOLEAN, value: true })).toEqual('true')
  expect(jsonGQLType.parseLiteral({ kind: Kind.INT, value: 20 })).toEqual('20')
  expect(jsonGQLType.parseLiteral({ kind: Kind.FLOAT, value: 3.1415 })).toEqual('3.1415')
  expect(jsonGQLType.parseLiteral({ kind: Kind.OBJECT, fields: [{ name: { value: 'a' }, value: { kind: Kind.INT, value: 1 } }, { name: { value: 'b' }, value: { kind: Kind.INT, value: 2 } }] })).toEqual('{"a":1,"b":2}')
  expect(jsonGQLType.parseLiteral({ kind: Kind.LIST, values: [{ kind: Kind.INT, value: 1 }, { kind: Kind.INT, value: 2 }, { kind: Kind.INT, value: 3 }] })).toEqual('[1,2,3]')
})
