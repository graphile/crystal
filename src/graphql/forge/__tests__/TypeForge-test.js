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
} from '../../../catalog'

import TypeForge from '../TypeForge'

const mockEnumType = new EnumType('enoom', ['a', 'b', 'c'])

const mockObjectType = {
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

Object.setPrototypeOf(mockObjectType, ObjectType.prototype)

const defaultOptions = {}

test('getOutputType and getInputType will return the exact same thing for types that are both inputs and outputs', t => {
  const typeForge = new TypeForge(defaultOptions)
  t.is(typeForge.getOutputType(mockEnumType), typeForge.getInputType(mockEnumType))
  t.not(typeForge.getOutputType(mockObjectType), typeForge.getInputType(mockObjectType))
})

test('getOutputType and getInputType are memoized', t => {
  const typeForge = new TypeForge(defaultOptions)
  t.is(typeForge.getOutputType(mockEnumType), typeForge.getOutputType(mockEnumType))
  t.is(typeForge.getInputType(mockEnumType), typeForge.getInputType(mockEnumType))
  t.is(typeForge.getOutputType(mockObjectType), typeForge.getOutputType(mockObjectType))
  t.is(typeForge.getInputType(mockObjectType), typeForge.getInputType(mockObjectType))
})

test('will invert nullable types', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType1 = typeForge.getOutputType(booleanType)
  t.true(gqlType1 instanceof GraphQLNonNull)
  t.is(gqlType1.ofType, GraphQLBoolean)
  const gqlType2 = typeForge.getOutputType(new NullableType(booleanType))
  t.is(gqlType2, GraphQLBoolean)
})

test('will remove many nullable wrappers', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType = typeForge.getOutputType(new NullableType(new NullableType(new NullableType(booleanType))))
  t.is(gqlType, GraphQLBoolean)
})

test('will clone base types for aliases', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType1 = typeForge.getOutputType(new AliasType('yo', booleanType))
  t.true(gqlType1 instanceof GraphQLNonNull)
  t.is(Object.getPrototypeOf(gqlType1.ofType), GraphQLBoolean)
  t.is(gqlType1.ofType.name, 'Yo')
  const gqlType2 = typeForge.getOutputType(new AliasType('yo', new NullableType(booleanType)))
  t.is(Object.getPrototypeOf(gqlType2), GraphQLBoolean)
  t.is(gqlType2.name, 'Yo')
  const gqlType3 = typeForge.getOutputType(new NullableType(new AliasType('yo', booleanType)))
  t.is(Object.getPrototypeOf(gqlType3), GraphQLBoolean)
  t.is(gqlType3.name, 'Yo')
})

test('will create lists correctly', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType1 = typeForge.getOutputType(new ListType(booleanType))
  t.true(gqlType1 instanceof GraphQLNonNull)
  t.true(gqlType1.ofType instanceof GraphQLList)
  t.true(gqlType1.ofType.ofType instanceof GraphQLNonNull)
  t.is(gqlType1.ofType.ofType.ofType, GraphQLBoolean)
  const gqlType2 = typeForge.getOutputType(new NullableType(new ListType(new NullableType(booleanType))))
  t.true(gqlType2 instanceof GraphQLList)
  t.is(gqlType2.ofType, GraphQLBoolean)
})

test('will correctly create enums', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType = typeForge.getOutputType(new NullableType(mockEnumType))
  t.true(gqlType instanceof GraphQLEnumType)
  t.is(gqlType.name, 'Enoom')
  t.deepEqual(gqlType.getValues().map(({ name }) => name), ['A', 'B', 'C'])
})

test('will correctly return primitive types', t => {
  const typeForge = new TypeForge(defaultOptions)
  t.is(typeForge.getOutputType(new NullableType(booleanType)), GraphQLBoolean)
  t.is(typeForge.getOutputType(new NullableType(integerType)), GraphQLInt)
  t.is(typeForge.getOutputType(new NullableType(floatType)), GraphQLFloat)
  t.is(typeForge.getOutputType(new NullableType(stringType)), GraphQLString)
})

test('getOutputType will correctly make an object type', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType = typeForge.getOutputType(new NullableType(mockObjectType))
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

test('getInputType will correctly make an object type', t => {
  const typeForge = new TypeForge(defaultOptions)
  const gqlType = typeForge.getInputType(new NullableType(mockObjectType))
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
