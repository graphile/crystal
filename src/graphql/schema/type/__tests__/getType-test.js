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
} from '../../../../interface'

import getType from '../getType'

const mockBuildToken = () => ({
  inventory: {
    getCollections: () => [],
  },
})

const mockEnumType = () => new EnumType('enoom', ['a', 'b', 'c'])

const mockObjectType = () => {
  const objectType = {
    getName: () => 'yo',
    getDescription: () => 'yoyoyo',
    getFields: () => [
      {
        getName: () => 'a',
        getDescription: () => 'aaaa!',
        getType: () => booleanType,
        getFieldValueFromObject: source => 1,
      },
      {
        getName: () => 'b',
        getDescription: () => undefined,
        getType: () => new NullableType(booleanType),
        getFieldValueFromObject: source => 2,
      },
    ]
  }

  Object.setPrototypeOf(objectType, ObjectType.prototype)

  return objectType
}

test('will return the exact same thing for types that are both inputs and outputs', () => {
  const buildToken = mockBuildToken()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getType(buildToken, enumType, false)).toBe(getType(buildToken, enumType, true))
  expect(getType(buildToken, objectType, false)).not.toBe(getType(buildToken, objectType, true))
})

test('is memoized', () => {
  const buildToken1 = mockBuildToken()
  const buildToken2 = mockBuildToken()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getType(buildToken1, enumType, false)).toBe(getType(buildToken1, enumType, false))
  expect(getType(buildToken1, enumType, true)).toBe(getType(buildToken1, enumType, true))
  expect(getType(buildToken1, objectType, false)).toBe(getType(buildToken1, objectType, false))
  expect(getType(buildToken1, objectType, true)).toBe(getType(buildToken1, objectType, true))
  expect(getType(buildToken2, enumType, false)).toBe(getType(buildToken2, enumType, false))
  expect(getType(buildToken2, enumType, true)).toBe(getType(buildToken2, enumType, true))
  expect(getType(buildToken2, objectType, false)).toBe(getType(buildToken2, objectType, false))
  expect(getType(buildToken2, objectType, true)).toBe(getType(buildToken2, objectType, true))
  expect(getType(buildToken1, enumType, false)).not.toBe(getType(buildToken2, enumType, false))
  expect(getType(buildToken1, enumType, true)).not.toBe(getType(buildToken2, enumType, true))
  expect(getType(buildToken1, objectType, false)).not.toBe(getType(buildToken2, objectType, false))
  expect(getType(buildToken1, objectType, true)).not.toBe(getType(buildToken2, objectType, true))
})

test('will invert nullable types', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getType(buildToken, booleanType, false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getType(buildToken, new NullableType(booleanType), false)
  expect(gqlType2).toBe(GraphQLBoolean)
})

test('will remove many nullable wrappers', () => {
  const buildToken = mockBuildToken()
  const gqlType = getType(buildToken, new NullableType(new NullableType(new NullableType(booleanType))), false)
  expect(gqlType).toBe(GraphQLBoolean)
})

test('will clone base types for aliases', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getType(buildToken, new AliasType('yo', booleanType), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(Object.getPrototypeOf(gqlType1.ofType)).toBe(GraphQLBoolean)
  expect(gqlType1.ofType.name).toBe('Yo')
  const gqlType2 = getType(buildToken, new AliasType('yo', new NullableType(booleanType)), false)
  expect(Object.getPrototypeOf(gqlType2)).toBe(GraphQLBoolean)
  expect(gqlType2.name).toBe('Yo')
  const gqlType3 = getType(buildToken, new NullableType(new AliasType('yo', booleanType)), false)
  expect(Object.getPrototypeOf(gqlType3)).toBe(GraphQLBoolean)
  expect(gqlType3.name).toBe('Yo')
})

test('will create lists correctly', () => {
  const buildToken = mockBuildToken()
  const gqlType1 = getType(buildToken, new ListType(booleanType), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType instanceof GraphQLList).toBe(true)
  expect(gqlType1.ofType.ofType instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType.ofType.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getType(buildToken, new NullableType(new ListType(new NullableType(booleanType))), false)
  expect(gqlType2 instanceof GraphQLList).toBe(true)
  expect(gqlType2.ofType).toBe(GraphQLBoolean)
})

test('will correctly create enums', () => {
  const buildToken = mockBuildToken()
  const gqlType = getType(buildToken, new NullableType(mockEnumType()), false)
  expect(gqlType instanceof GraphQLEnumType).toBe(true)
  expect(gqlType.name).toBe('Enoom')
  expect(gqlType.getValues().map(({ name }) => name)).toEqual(['A', 'B', 'C'])
})

test('will correctly return primitive types', () => {
  const buildToken = mockBuildToken()
  expect(getType(buildToken, new NullableType(booleanType), false)).toBe(GraphQLBoolean)
  expect(getType(buildToken, new NullableType(integerType), false)).toBe(GraphQLInt)
  expect(getType(buildToken, new NullableType(floatType), false)).toBe(GraphQLFloat)
  expect(getType(buildToken, new NullableType(stringType), false)).toBe(GraphQLString)
})

test('will correctly make an object output type', () => {
  const buildToken = mockBuildToken()
  const gqlType = getType(buildToken, new NullableType(mockObjectType()), false)
  expect(gqlType instanceof GraphQLObjectType).toBe(true)
  expect(gqlType.name).toBe('Yo')
  expect(gqlType.description).toBe('yoyoyo')
  expect(gqlType.getFields().a.name).toBe('a')
  expect(gqlType.getFields().a.description).toBe('aaaa!')
  expect(gqlType.getFields().a.type instanceof GraphQLNonNull).toBe(true)
  expect(gqlType.getFields().a.type.ofType).toBe(GraphQLBoolean)
  expect(gqlType.getFields().a.resolve()).toBe(1)
  expect(gqlType.getFields().b.name).toBe('b')
  expect(gqlType.getFields().b.description).toBe(undefined)
  expect(gqlType.getFields().b.type).toBe(GraphQLBoolean)
  expect(gqlType.getFields().b.resolve()).toBe(2)
})

test('will correctly make an input object type', () => {
  const buildToken = mockBuildToken()
  const gqlType = getType(buildToken, new NullableType(mockObjectType()), true)
  expect(gqlType instanceof GraphQLInputObjectType).toBe(true)
  expect(gqlType.name).toBe('YoInput')
  expect(gqlType.description).toBe('yoyoyo')
  expect(gqlType.getFields().a.name).toBe('a')
  expect(gqlType.getFields().a.description).toBe('aaaa!')
  expect(gqlType.getFields().a.type instanceof GraphQLNonNull).toBe(true)
  expect(gqlType.getFields().a.type.ofType).toBe(GraphQLBoolean)
  expect(gqlType.getFields().b.name).toBe('b')
  expect(gqlType.getFields().b.description).toBe(undefined)
  expect(gqlType.getFields().b.type).toBe(GraphQLBoolean)
})
