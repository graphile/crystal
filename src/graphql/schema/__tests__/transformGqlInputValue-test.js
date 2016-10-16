import { GraphQLInt, GraphQLInputObjectType } from 'graphql'
import transformGqlInputValue, { $$gqlInputObjectTypeValueKeyName } from '../transformGqlInputValue'

test('will turn GraphQLInputObjectType values into a map', () => {
  const type = new GraphQLInputObjectType({
    name: 'foo',
    fields: {
      a: { type: GraphQLInt },
      b: { type: GraphQLInt },
      c: { type: GraphQLInt },
    },
  })
  expect(transformGqlInputValue(type, { a: 1, b: 2, c: 3 })).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]))
})

test('will just return null for GraphQLInputObjectType if given null', () => {
  const type = new GraphQLInputObjectType({
    name: 'foo',
    fields: {
      a: { type: GraphQLInt },
      b: { type: GraphQLInt },
      c: { type: GraphQLInt },
    },
  })
  expect(transformGqlInputValue(type, null)).toEqual(null)
})

test('will throw an error for GraphQLInputObjectType if the value is not an object', () => {
  const type = new GraphQLInputObjectType({
    name: 'foo',
    fields: {
      a: { type: GraphQLInt },
      b: { type: GraphQLInt },
      c: { type: GraphQLInt },
    },
  })
  expect(() => transformGqlInputValue(type, 5)).toThrow('Value of a GraphQL input object type must be an object, not \'number\'.')
})

test('will rename fields in GraphQLInputObjectType to the correct name if provided', () => {
  const type = new GraphQLInputObjectType({
    name: 'foo',
    fields: {
      a: { type: GraphQLInt, [$$gqlInputObjectTypeValueKeyName]: 'x_a' },
      b: { type: GraphQLInt, [$$gqlInputObjectTypeValueKeyName]: 'x_b' },
      c: { type: GraphQLInt, [$$gqlInputObjectTypeValueKeyName]: 'x_c' },
    },
  })
  expect(transformGqlInputValue(type, { a: 1, b: 2, c: 3 }))
    .toEqual(new Map([['x_a', 1], ['x_b', 2], ['x_c', 3]]))
})
