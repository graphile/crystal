jest.mock('../getQueryGqlType')

import { GraphQLNonNull, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import getQueryGqlType, { $$isQuery } from '../getQueryGqlType'
import createMutationGqlField from '../createMutationGqlField'

// Create a new object where `GraphQLString` is the prototype. This means it
// will have the exact same behavior as `GraphQLString`, however
// `queryType !== GraphQLString` which is nice for tests.
const queryType = Object.create(GraphQLString)

getQueryGqlType.mockReturnValue(queryType)

test('will only create a single input argument', () => {
  const field = createMutationGqlField({}, { name: 'foo' })
  expect(Object.keys(field.args)).toEqual(['input'])
})

test('will create a non-null input type for the input argument with the correct name', () => {
  const field = createMutationGqlField({}, { name: 'foo' })
  expect(field.args.input.type instanceof GraphQLNonNull).toBe(true)
  expect(field.args.input.type.ofType instanceof GraphQLInputObjectType).toBe(true)
  expect(field.args.input.type.ofType.name).toBe('FooInput')
})

test('will always add a `clientMutationId` field to input objects', () => {
  const field = createMutationGqlField({}, { name: 'foo' })
  expect(Object.keys(field.args.input.type.ofType.getFields())).toEqual(['clientMutationId'])
  expect(field.args.input.type.ofType.getFields().clientMutationId.type).toEqual(GraphQLString)
})

test('will add extra input fields from the config and skip falsies', () => {
  const inputFields = [
    ['a', { name: 'a', type: GraphQLString }],
    null,
    ['b', { name: 'b', type: GraphQLString }],
    ['c', { name: 'c', type: GraphQLString }],
  ]
  const field = createMutationGqlField({}, { name: 'foo', inputFields })
  expect(Object.keys(field.args.input.type.ofType.getFields())).toEqual(['clientMutationId', 'a', 'b', 'c'])
  expect(field.args.input.type.ofType.getFields().a).toEqual(inputFields[0][1])
  expect(field.args.input.type.ofType.getFields().b).toEqual(inputFields[2][1])
  expect(field.args.input.type.ofType.getFields().c).toEqual(inputFields[3][1])
})

test('will return an object payload type', () => {
  const field = createMutationGqlField({}, { name: 'foo' })
  expect(field.type instanceof GraphQLObjectType).toBe(true)
  expect(field.type.name).toBe('FooPayload')
})

test('will always include `clientMutationId` and `query` fields', () => {
  getQueryGqlType.mockClear()
  const buildToken = Symbol('buildToken')
  const clientMutationId = Symbol('clientMutationId')
  const field = createMutationGqlField(buildToken, { name: 'foo' })
  expect(Object.keys(field.type.getFields())).toEqual(['clientMutationId', 'query'])
  expect(field.type.getFields().clientMutationId.type).toBe(GraphQLString)
  expect(field.type.getFields().clientMutationId.resolve({ clientMutationId })).toBe(clientMutationId)
  expect(field.type.getFields().query.type).toBe(queryType)
  expect(field.type.getFields().query.resolve()).toBe($$isQuery)
  expect(getQueryGqlType.mock.calls).toEqual([[buildToken]])
})

test('will add `outputFields` in payload type and skip falsies', () => {
  const resolve = Symbol('resolve')
  const description = Symbol('description')
  const deprecationReason = Symbol('deprecationReason')
  const outputFields = [
    ['a', { type: GraphQLString }],
    null,
    ['b', { type: GraphQLString }],
    ['c', { type: GraphQLString, args: { arg: { type: GraphQLString } }, resolve, description, deprecationReason }],
  ]
  const field = createMutationGqlField({}, { name: 'foo', outputFields })
  expect(Object.keys(field.type.getFields())).toEqual(['clientMutationId', 'a', 'b', 'c', 'query'])
  expect(field.type.getFields().a).toEqual({ name: 'a', type: GraphQLString, args: [], resolve: null, isDeprecated: false })
  expect(field.type.getFields().b).toEqual({ name: 'b', type: GraphQLString, args: [], resolve: null, isDeprecated: false })
  expect(field.type.getFields().c).toEqual({ name: 'c', type: GraphQLString, args: [{ name: 'arg', type: GraphQLString, defaultValue: null, description: null }], resolve: field.type.getFields().c.resolve, description, deprecationReason, isDeprecated: true })
})

test('will proxy the resolved value to the resolver in `outputFields`', () => {
  const value = Symbol('value')
  const resolvedValue = Symbol('resolvedValue')
  const restArgs = [Symbol(), Symbol(), Symbol()]
  const resolve = jest.fn(() => resolvedValue)
  const field = createMutationGqlField({}, { name: 'foo', outputFields: [['a', { type: GraphQLString, resolve }]] })
  expect(field.type.getFields().a.resolve({ value }, ...restArgs)).toBe(resolvedValue)
  expect(resolve.mock.calls).toEqual([[value, ...restArgs]])
})

// test('resolve will call the execute function with the correct arguments', async () => {
//   const context = new Context()
//   const clientMutationId = Symbol('clientMutationId')
//   const input = { clientMutationId, a: 1, b: 2, c: 3 }
//   const value = Symbol('value')
//   const execute = jest.fn(() => value)
//   const field = createMutationGqlField({}, { name: 'foo', execute })
//   expect(await field.resolve({}, { input }, context)).toEqual({ clientMutationId, value })
//   expect(execute.mock.calls).toEqual([[context, input]])
// })
