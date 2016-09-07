import test from 'ava'

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

test('will return the exact same thing for types that are both inputs and outputs', t => {
  const context = mockContext()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  t.is(getType(context, enumType, false), getType(context, enumType, true))
  t.not(getType(context, objectType, false), getType(context, objectType, true))
})

test('is memoized', t => {
  const context = mockContext()
  const enumType = mockEnumType()
  const objectType = mockObjectType()
  t.is(getType(context, enumType, false), getType(context, enumType, false))
  t.is(getType(context, enumType, true), getType(context, enumType, true))
  t.is(getType(context, objectType, false), getType(context, objectType, false))
  t.is(getType(context, objectType, true), getType(context, objectType, true))
})

test('will invert nullable types', t => {
  const context = mockContext()
  const gqlType1 = getType(context, booleanType, false)
  t.true(gqlType1 instanceof GraphQLNonNull)
  t.is(gqlType1.ofType, GraphQLBoolean)
  const gqlType2 = getType(context, new NullableType(booleanType), false)
  t.is(gqlType2, GraphQLBoolean)
})

test('will remove many nullable wrappers', t => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(new NullableType(new NullableType(booleanType))), false)
  t.is(gqlType, GraphQLBoolean)
})

test('will clone base types for aliases', t => {
  const context = mockContext()
  const gqlType1 = getType(context, new AliasType('yo', booleanType), false)
  t.true(gqlType1 instanceof GraphQLNonNull)
  t.is(Object.getPrototypeOf(gqlType1.ofType), GraphQLBoolean)
  t.is(gqlType1.ofType.name, 'Yo')
  const gqlType2 = getType(context, new AliasType('yo', new NullableType(booleanType)), false)
  t.is(Object.getPrototypeOf(gqlType2), GraphQLBoolean)
  t.is(gqlType2.name, 'Yo')
  const gqlType3 = getType(context, new NullableType(new AliasType('yo', booleanType)), false)
  t.is(Object.getPrototypeOf(gqlType3), GraphQLBoolean)
  t.is(gqlType3.name, 'Yo')
})

test('will create lists correctly', t => {
  const context = mockContext()
  const gqlType1 = getType(context, new ListType(booleanType), false)
  t.true(gqlType1 instanceof GraphQLNonNull)
  t.true(gqlType1.ofType instanceof GraphQLList)
  t.true(gqlType1.ofType.ofType instanceof GraphQLNonNull)
  t.is(gqlType1.ofType.ofType.ofType, GraphQLBoolean)
  const gqlType2 = getType(context, new NullableType(new ListType(new NullableType(booleanType))), false)
  t.true(gqlType2 instanceof GraphQLList)
  t.is(gqlType2.ofType, GraphQLBoolean)
})

test('will correctly create enums', t => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(mockEnumType()), false)
  t.true(gqlType instanceof GraphQLEnumType)
  t.is(gqlType.name, 'Enoom')
  t.deepEqual(gqlType.getValues().map(({ name }) => name), ['A', 'B', 'C'])
})

test('will correctly return primitive types', t => {
  const context = mockContext()
  t.is(getType(context, new NullableType(booleanType), false), GraphQLBoolean)
  t.is(getType(context, new NullableType(integerType), false), GraphQLInt)
  t.is(getType(context, new NullableType(floatType), false), GraphQLFloat)
  t.is(getType(context, new NullableType(stringType), false), GraphQLString)
})

test('will correctly make an object output type', t => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(mockObjectType()), false)
  t.true(gqlType instanceof GraphQLObjectType)
  t.is(gqlType.name, 'Yo')
  t.is(gqlType.description, 'yoyoyo')
  t.is(gqlType.getFields().a.name, 'a')
  t.is(gqlType.getFields().a.description, 'aaaa!')
  t.true(gqlType.getFields().a.type instanceof GraphQLNonNull)
  t.is(gqlType.getFields().a.type.ofType, GraphQLBoolean)
  t.is(gqlType.getFields().a.resolve(), 1)
  t.is(gqlType.getFields().b.name, 'b')
  t.is(gqlType.getFields().b.description, undefined)
  t.is(gqlType.getFields().b.type, GraphQLBoolean)
  t.is(gqlType.getFields().b.resolve(), 2)
})

test('will correctly make an input object type', t => {
  const context = mockContext()
  const gqlType = getType(context, new NullableType(mockObjectType()), true)
  t.true(gqlType instanceof GraphQLInputObjectType)
  t.is(gqlType.name, 'YoInput')
  t.is(gqlType.description, 'yoyoyo')
  t.is(gqlType.getFields().a.name, 'a')
  t.is(gqlType.getFields().a.description, 'aaaa!')
  t.true(gqlType.getFields().a.type instanceof GraphQLNonNull)
  t.is(gqlType.getFields().a.type.ofType, GraphQLBoolean)
  t.is(gqlType.getFields().b.name, 'b')
  t.is(gqlType.getFields().b.description, undefined)
  t.is(gqlType.getFields().b.type, GraphQLBoolean)
})
