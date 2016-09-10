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
} from '../../../../catalog'

import getType from '../getType'

const mockContext = () => ({
  catalog: {
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
  const context = mockContext()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getType(context, enumType, false)).toBe(getType(context, enumType, true))
  expect(getType(context, objectType, false)).not.toBe(getType(context, objectType, true))
})

test('is memoized', () => {
  const context1 = mockContext()
  const context2 = mockContext()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  expect(getType(context1, enumType, false)).toBe(getType(context1, enumType, false))
  expect(getType(context1, enumType, true)).toBe(getType(context1, enumType, true))
  expect(getType(context1, objectType, false)).toBe(getType(context1, objectType, false))
  expect(getType(context1, objectType, true)).toBe(getType(context1, objectType, true))
  expect(getType(context2, enumType, false)).toBe(getType(context2, enumType, false))
  expect(getType(context2, enumType, true)).toBe(getType(context2, enumType, true))
  expect(getType(context2, objectType, false)).toBe(getType(context2, objectType, false))
  expect(getType(context2, objectType, true)).toBe(getType(context2, objectType, true))
  expect(getType(context1, enumType, false)).not.toBe(getType(context2, enumType, false))
  expect(getType(context1, enumType, true)).not.toBe(getType(context2, enumType, true))
  expect(getType(context1, objectType, false)).not.toBe(getType(context2, objectType, false))
  expect(getType(context1, objectType, true)).not.toBe(getType(context2, objectType, true))
})

test('will invert nullable types', () => {
  const context = mockContext()
  const gqlType1 = getType(context, booleanType, false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getType(context, new NullableType(booleanType), false)
  expect(gqlType2).toBe(GraphQLBoolean)
})

test('will remove many nullable wrappers', () => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(new NullableType(new NullableType(booleanType))), false)
  expect(gqlType).toBe(GraphQLBoolean)
})

test('will clone base types for aliases', () => {
  const context = mockContext()
  const gqlType1 = getType(context, new AliasType('yo', booleanType), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(Object.getPrototypeOf(gqlType1.ofType)).toBe(GraphQLBoolean)
  expect(gqlType1.ofType.name).toBe('Yo')
  const gqlType2 = getType(context, new AliasType('yo', new NullableType(booleanType)), false)
  expect(Object.getPrototypeOf(gqlType2)).toBe(GraphQLBoolean)
  expect(gqlType2.name).toBe('Yo')
  const gqlType3 = getType(context, new NullableType(new AliasType('yo', booleanType)), false)
  expect(Object.getPrototypeOf(gqlType3)).toBe(GraphQLBoolean)
  expect(gqlType3.name).toBe('Yo')
})

test('will create lists correctly', () => {
  const context = mockContext()
  const gqlType1 = getType(context, new ListType(booleanType), false)
  expect(gqlType1 instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType instanceof GraphQLList).toBe(true)
  expect(gqlType1.ofType.ofType instanceof GraphQLNonNull).toBe(true)
  expect(gqlType1.ofType.ofType.ofType).toBe(GraphQLBoolean)
  const gqlType2 = getType(context, new NullableType(new ListType(new NullableType(booleanType))), false)
  expect(gqlType2 instanceof GraphQLList).toBe(true)
  expect(gqlType2.ofType).toBe(GraphQLBoolean)
})

test('will correctly create enums', () => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(mockEnumType()), false)
  expect(gqlType instanceof GraphQLEnumType).toBe(true)
  expect(gqlType.name).toBe('Enoom')
  expect(gqlType.getValues().map(({ name }) => name)).toEqual(['A', 'B', 'C'])
})

test('will correctly return primitive types', () => {
  const context = mockContext()
  expect(getType(context, new NullableType(booleanType), false)).toBe(GraphQLBoolean)
  expect(getType(context, new NullableType(integerType), false)).toBe(GraphQLInt)
  expect(getType(context, new NullableType(floatType), false)).toBe(GraphQLFloat)
  expect(getType(context, new NullableType(stringType), false)).toBe(GraphQLString)
})

test('will correctly make an object output type', () => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(mockObjectType()), false)
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
  const context = mockContext()
  const gqlType = getType(context, new NullableType(mockObjectType()), true)
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
